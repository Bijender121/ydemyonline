import {PlayIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

// Matches the providers the lesson page can embed (AGENTS.md §9).
export const VIDEO_HOSTS = [
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
  'vimeo.com',
  'player.vimeo.com',
  'iframe.mediadelivery.net',
  'player.mediadelivery.net',
  'video.bunnycdn.com',
]

export const lesson = defineType({
  name: 'lesson',
  type: 'document',
  icon: PlayIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'video', title: 'Video'},
    {name: 'resources', title: 'Resources'},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'content',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 2,
      group: 'content',
      description: 'One or two sentences shown under the title and on search results.',
      validation: (rule) => [
        rule.required(),
        rule.max(200).warning('Keep the summary under 200 characters.'),
      ],
    }),
    defineField({
      name: 'notes',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading 2', value: 'h2'},
            {title: 'Heading 3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          fields: [defineField({name: 'alt', type: 'string', title: 'Alternative Text'})],
        }),
      ],
    }),
    defineField({
      name: 'keyPoints',
      title: 'In This Lesson You Will',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: 'proTip',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      group: 'video',
      description: 'YouTube, Vimeo, or Bunny video URL.',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) return true
          try {
            const host = new URL(value).hostname
            return VIDEO_HOSTS.includes(host) || 'Use a YouTube, Vimeo, or Bunny video URL.'
          } catch {
            return 'Enter a valid URL.'
          }
        }),
    }),
    defineField({
      name: 'poster',
      type: 'image',
      group: 'video',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', title: 'Alternative Text'})],
    }),
    defineField({
      name: 'durationSeconds',
      title: 'Duration (seconds)',
      type: 'number',
      group: 'video',
      validation: (rule) => rule.required().integer().positive(),
    }),
    defineField({
      name: 'freePreview',
      type: 'boolean',
      group: 'video',
      description: 'Shows a "Free preview" label. Not access control.',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      type: 'number',
      group: 'video',
      description: 'Display only.',
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: 'resources',
      type: 'array',
      group: 'resources',
      of: [defineArrayMember({type: 'resource'})],
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'summary', media: 'poster'},
  },
})
