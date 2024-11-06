import {defineField, defineType} from 'sanity'

export const banner = defineType({
  name: 'banner',
  title: 'Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().error('Title is required'),
    }),
    defineField({
      name: 'bannerImage',
      title: 'Background Image',
      type: 'sanityImage',
      validation: (Rule) => Rule.required().error('Background Image is required'),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'link',
      validation: (Rule) => Rule.required().error('Link is required'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'bannerImage.asset',
    },
  },
})
