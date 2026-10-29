import {CheckmarkCircleIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

// The web app maps each value to a matching lucide icon.
export const LEARNING_OUTCOME_ICONS = [
  'layers',
  'database',
  'gauge',
  'cloud',
  'code',
  'shield',
  'rocket',
  'zap',
  'server',
  'globe',
  'lock',
  'terminal',
] as const

export const learningOutcome = defineType({
  name: 'learningOutcome',
  type: 'object',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'icon',
      type: 'string',
      options: {list: [...LEARNING_OUTCOME_ICONS]},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description'},
  },
})
