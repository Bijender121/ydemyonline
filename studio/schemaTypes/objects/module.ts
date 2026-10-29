import {FolderIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

// Embedded in a course. Module and lesson numbers are derived from order, never stored.
export const courseModule = defineType({
  name: 'module',
  type: 'object',
  icon: FolderIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'lessons',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'lesson'}]})],
      validation: (rule) => rule.required().min(1).unique(),
    }),
  ],
  preview: {
    select: {title: 'title', lessons: 'lessons'},
    prepare: ({title, lessons}) => {
      const count = Array.isArray(lessons) ? lessons.length : 0
      return {title, subtitle: `${count} ${count === 1 ? 'lesson' : 'lessons'}`}
    },
  },
})
