import {defineField, defineType} from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required().error('Name is required'),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
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
      name: 'image',
      type: 'image',
    }),
    defineField({
      name: 'bio',
      type: 'array',
      title: 'About',
      of: [
        {
          type: 'block',
        },
      ],
    }),
  ],
})
