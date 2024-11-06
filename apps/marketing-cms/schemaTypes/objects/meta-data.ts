import {defineField, defineType} from 'sanity'

export const metaData = defineType({
  title: 'Meta Data',
  name: 'metaData',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().error('Title is required'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
      validation: (Rule) => Rule.required().error('Description is required'),
    }),
  ],
})
