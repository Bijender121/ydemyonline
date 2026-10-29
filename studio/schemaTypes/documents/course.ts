import {BookIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const course = defineType({
  name: 'course',
  type: 'document',
  icon: BookIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'marketing', title: 'Marketing'},
    {name: 'curriculum', title: 'Curriculum'},
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
      rows: 3,
      group: 'content',
      validation: (rule) => [
        rule.required(),
        rule.max(200).warning('Keep the summary under 200 characters.'),
      ],
    }),
    defineField({
      name: 'level',
      type: 'string',
      group: 'content',
      options: {
        list: [
          {title: 'Beginner', value: 'beginner'},
          {title: 'Intermediate', value: 'intermediate'},
          {title: 'Advanced', value: 'advanced'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'instructor',
      type: 'reference',
      group: 'content',
      to: [{type: 'instructor'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'reference',
      group: 'content',
      to: [{type: 'category'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'coverImage',
      type: 'image',
      group: 'marketing',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', title: 'Alternative Text'})],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      type: 'number',
      group: 'marketing',
      description: 'USD. 0 means free.',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'popular',
      type: 'boolean',
      group: 'marketing',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      type: 'number',
      group: 'marketing',
      description: 'Display only.',
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: 'learningOutcomes',
      title: "What You'll Learn",
      type: 'array',
      group: 'marketing',
      of: [defineArrayMember({type: 'learningOutcome'})],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: 'modules',
      type: 'array',
      group: 'curriculum',
      of: [defineArrayMember({type: 'module'})],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {title: 'title', level: 'level', media: 'coverImage'},
    prepare: ({title, level, media}) => ({title, subtitle: level, media}),
  },
})
