import {defineField, defineType} from 'sanity'

export const resource = defineType({
  name: 'resource',
  title: 'Resource',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => [Rule.required().error('Title is required')],
    }),
    defineField({
      name: 'metaData',
      title: 'Meta Data',
      type: 'metaData',
      validation: (Rule) => [Rule.required().error('Meta Data is required')],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'sanityImage',
      validation: (Rule) => Rule.required().error('Main Image is required'),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (Rule) => [Rule.required().error('Category is required')],
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) =>
        Rule.required()
          .error('Required to generate a page')
          .custom((slug) => {
            if (slug && slug.current && slug.current.length > 96) {
              return 'Slug must be 96 characters or fewer'
            }
            return true
          }),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
      validation: (Rule) => Rule.required().error('Author is required to generate a page'),
    }),
    defineField({
      name: 'tag',
      title: 'Tag',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'tag'}],
        },
      ],
      validation: (Rule) => [
        Rule.required().error('You must select at least one tag'),
        Rule.max(5).error('You can select a maximum of 5 tags'),
      ],
    }),
    defineField({
      name: 'relatedResource',
      title: 'Related Resource',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'resource'}],
        },
      ],
      validation: (Rule) => [Rule.max(3).error('You can select a maximum of 3 resources')],
    }),
    defineField({
      name: 'socialNetwork',
      title: 'Social network',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'socialNetwork'}],
        },
      ],
    }),
    defineField({
      name: 'timeToRead',
      title: 'Time to Read in minutes',
      type: 'number',
    }),
    defineField({
      name: 'preview',
      title: 'Preview Text',
      type: 'string',
      validation: (Rule) => Rule.required().error('Preview Text is required'),
    }),
    defineField({
      name: 'content',
      type: 'array',
      title: 'Content',
      of: [{type: 'oneColumn'}, {type: 'twoColumn'}],
    }),
  ],
})
