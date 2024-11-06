import {defineField, defineType} from 'sanity'

export const quote = defineType({
  name: 'quote',
  title: 'Quote',
  type: 'object',
  fields: [
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      description: 'Author of the quote and job title, e.g. "John Doe, CEO"',
      validation: (Rule) => Rule.required().error('Author is required'),
    }),
    defineField({
      name: 'quoteText',
      title: 'Text',
      type: 'text',
      validation: (Rule) => Rule.required().error('Text is required'),
    }),
  ],
  preview: {
    select: {
      quoteText: 'quoteText',
    },
    prepare({quoteText}) {
      const firstBlock = quoteText.split(' ').slice(0, 10).join(' ')
      return {
        title: firstBlock || 'Quote Text',
        subtitle: 'Quote Text',
      }
    },
  },
})
