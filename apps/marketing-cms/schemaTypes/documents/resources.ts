import {defineField, defineType} from 'sanity'

export const resources = defineType({
  name: 'resources',
  title: 'Resources',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => [Rule.required().error('Title is required')],
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      validation: (Rule) => [Rule.required().error('Subtitle is required')],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'category'}],
        },
      ],
      validation: (Rule) => [Rule.max(10).error('You can select a maximum of 10 categories')],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'sanityImage',
      validation: (Rule) => Rule.required().error('Main Image is required'),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'reference',
      to: [{type: 'resource'}],
    }),
  ],
})
