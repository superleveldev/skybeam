import {defineField, defineType} from 'sanity'

export const sanityImage = defineType({
  name: 'sanityImage',
  title: 'Sanity Image',
  type: 'image',
  options: {
    hotspot: true,
    metadata: ['image', 'lqip', 'palette'],
  },
  fields: [
    defineField({
      description: 'Name of the image',
      name: 'name',
      title: 'Image Name',
      type: 'string',
      validation: (Rule) => Rule.required().error('Image name is required'),
    }),
    defineField({
      description: 'Important for accessibility and SEO',
      name: 'alt',
      title: 'Alternative Text',
      type: 'string',
      validation: (Rule) => Rule.required().error('Alternative text is required'),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'asset',
    },
  },
})
