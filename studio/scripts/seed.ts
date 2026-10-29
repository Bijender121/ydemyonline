/**
 * Seeds the Vertex catalog from scripts/seed/seed.ndjson. Idempotent: documents
 * have fixed ids and are written with createOrReplace, and Sanity dedupes
 * uploaded assets by hash, so re-running converges on the same dataset.
 *
 *   npm run seed
 *
 * Before writing, the seed is checked for relational integrity (every reference
 * resolves, every lesson sits in exactly one module). Content docs left over
 * from earlier seeds (ids not in the file) are deleted in the same transaction.
 *
 * Images use the import-style directive `_sanityAsset: "image@<url>"`, where
 * <url> is https://… or file://<path relative to scripts/seed/>.
 */
import {readFile} from 'node:fs/promises'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'
import {LEARNING_OUTCOME_ICONS} from '../schemaTypes/objects/learning-outcome'
import {VIDEO_HOSTS} from '../schemaTypes/documents/lesson'

const client = getCliClient({apiVersion: '2026-10-29'})
const SEED_DIR = path.resolve(process.cwd(), 'scripts', 'seed')
const CONTENT_TYPES = ['category', 'instructor', 'course', 'lesson']

type Ref = {_type: 'reference'; _ref: string; _key?: string}
type Doc = {_id: string; _type: string; [field: string]: unknown}
type Lesson = Doc & {title: string; summary: string; videoUrl: string; durationSeconds: number}
type Module = {_key: string; title: string; lessons: Ref[]}
type Course = Doc & {title: string; modules: Module[]; learningOutcomes: {icon: string}[]; studentCount: number}

async function readSeed(): Promise<Doc[]> {
  const raw = await readFile(path.join(SEED_DIR, 'seed.ndjson'), 'utf8')
  return raw
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line))
}

function collectRefs(value: unknown, refs: string[] = []): string[] {
  if (Array.isArray(value)) value.forEach((item) => collectRefs(item, refs))
  else if (value && typeof value === 'object') {
    const object = value as Record<string, unknown>
    if (object._type === 'reference' && typeof object._ref === 'string') refs.push(object._ref)
    Object.values(object).forEach((item) => collectRefs(item, refs))
  }
  return refs
}

function check(docs: Doc[]) {
  const errors: string[] = []
  const byId = new Map(docs.map((doc) => [doc._id, doc]))
  if (byId.size !== docs.length) errors.push('Duplicate _id in seed.')

  const slugs = new Set<string>()
  for (const doc of docs) {
    const slug = `${doc._type}:${(doc.slug as {current?: string})?.current}`
    if (slugs.has(slug)) errors.push(`Duplicate slug ${slug}`)
    slugs.add(slug)
    for (const ref of collectRefs(doc)) {
      if (!byId.has(ref)) errors.push(`${doc._id} references missing ${ref}`)
    }
  }

  const placements = new Map<string, number>()
  const lessons = docs.filter((doc): doc is Lesson => doc._type === 'lesson')
  const courses = docs.filter((doc): doc is Course => doc._type === 'course')
  for (const course of courses) {
    if (!course.modules?.length) errors.push(`${course._id} has no modules`)
    for (const module of course.modules ?? []) {
      if (!module.lessons?.length) errors.push(`${course._id} module "${module.title}" has no lessons`)
      for (const {_ref} of module.lessons ?? []) {
        if (byId.get(_ref)?._type !== 'lesson') errors.push(`${course._id} module "${module.title}" references non-lesson ${_ref}`)
        placements.set(_ref, (placements.get(_ref) ?? 0) + 1)
        const lesson = byId.get(_ref) as Lesson | undefined
        if (lesson && Number(lesson.studentCount) > course.studentCount) {
          errors.push(`${_ref} has more students than ${course._id}`)
        }
      }
    }
    for (const {icon} of course.learningOutcomes ?? []) {
      if (!(LEARNING_OUTCOME_ICONS as readonly string[]).includes(icon)) errors.push(`${course._id} uses unknown icon ${icon}`)
    }
  }

  for (const lesson of lessons) {
    const count = placements.get(lesson._id) ?? 0
    if (count !== 1) errors.push(`${lesson._id} is placed in ${count} modules (expected 1)`)
    if (!lesson.summary) errors.push(`${lesson._id} has no summary`)
    if (!Number.isInteger(lesson.durationSeconds) || lesson.durationSeconds <= 0) errors.push(`${lesson._id} has an invalid duration`)
    if (!VIDEO_HOSTS.includes(new URL(lesson.videoUrl).hostname)) errors.push(`${lesson._id} has an unsupported video host`)
  }

  if (errors.length) throw new Error(`Seed check failed:\n  ${errors.join('\n  ')}`)
}

// Replaces every `_sanityAsset` directive with a reference to an uploaded asset.
async function resolveAssets(docs: Doc[]) {
  const uploaded = new Map<string, Promise<string>>()

  const upload = (directive: string) => {
    if (!uploaded.has(directive)) {
      const [, kind, source] = directive.match(/^(image|file)@(.+)$/) ?? []
      if (!kind) throw new Error(`Bad asset directive: ${directive}`)
      uploaded.set(
        directive,
        (async () => {
          const filename = path.basename(new URL(source).pathname)
          const body = source.startsWith('file://')
            ? await readFile(path.join(SEED_DIR, source.slice('file://'.length)))
            : Buffer.from(await (await fetchOk(source)).arrayBuffer())
          const asset = await withRetry(() => client.assets.upload(kind as 'image' | 'file', body, {filename}))
          return asset._id
        })(),
      )
    }
    return uploaded.get(directive)!
  }

  const walk = async (value: unknown): Promise<void> => {
    if (Array.isArray(value)) await Promise.all(value.map(walk))
    else if (value && typeof value === 'object') {
      const object = value as Record<string, unknown>
      if (typeof object._sanityAsset === 'string') {
        object.asset = {_type: 'reference', _ref: await upload(object._sanityAsset)}
        delete object._sanityAsset
      }
      await Promise.all(Object.values(object).map(walk))
    }
  }

  // Small batches keep remote hosts and the asset API from rate limiting us.
  for (let i = 0; i < docs.length; i += 10) await Promise.all(docs.slice(i, i + 10).map(walk))
  return uploaded.size
}

// The asset API occasionally answers 429/5xx under parallel uploads.
async function withRetry<T>(run: () => Promise<T>, attempts = 4): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await run()
    } catch (error) {
      const status = (error as {statusCode?: number}).statusCode ?? 0
      if (attempt >= attempts || (status !== 429 && status < 500)) throw error
      await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** attempt))
    }
  }
}

async function fetchOk(url: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`GET ${url} failed with ${response.status}`)
  return response
}

const formatDuration = (seconds: number) => `${Math.floor(seconds / 3600)}h ${Math.round((seconds % 3600) / 60)}m`

function summarize(docs: Doc[]) {
  const durations = new Map(
    docs.filter((doc) => doc._type === 'lesson').map((doc) => [doc._id, (doc as Lesson).durationSeconds]),
  )
  for (const course of docs.filter((doc): doc is Course => doc._type === 'course')) {
    const modules = course.modules.map((module) =>
      module.lessons.reduce((sum, {_ref}) => sum + (durations.get(_ref) ?? 0), 0),
    )
    const lessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0)
    const total = modules.reduce((sum, seconds) => sum + seconds, 0)
    console.log(`  ${course.title}: ${course.modules.length} modules · ${lessons} lessons · ${formatDuration(total)}`)
  }
}

async function seed() {
  const docs = await readSeed()
  check(docs)
  console.log(`Seed checks passed for ${docs.length} documents.`)

  const assets = await resolveAssets(docs)
  console.log(`Resolved ${assets} assets.`)

  const ids = docs.map((doc) => doc._id)
  const stale: string[] = await client.fetch(
    `*[_type in $types && !(_id in $ids) && !(_id in $drafts)]._id`,
    {types: CONTENT_TYPES, ids, drafts: ids.map((id) => `drafts.${id}`)},
    {perspective: 'raw'},
  )

  const order = (doc: Doc) => CONTENT_TYPES.indexOf(doc._type)
  const transaction = client.transaction()
  for (const doc of [...docs].sort((a, b) => order(a) - order(b))) transaction.createOrReplace(doc)
  for (const id of stale) transaction.delete(id)
  await transaction.commit()

  console.log(`Wrote ${docs.length} documents, pruned ${stale.length} old documents.`)
  summarize(docs)
}

seed()
  .then(() => console.log('Seed complete.'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
