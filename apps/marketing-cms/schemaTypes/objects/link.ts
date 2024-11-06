import {defineField, defineType} from 'sanity'

export const link = defineType({
  title: 'URL',
  name: 'link',
  type: 'object',
  initialValue: {
    blank: false,
  },
  fields: [
    defineField({
      title: 'URL',
      name: 'href',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          allowRelative: true,
          scheme: ['https', 'http', 'mailto', 'tel'],
        }),
    }),
    defineField({
      title: 'Open in new tab?',
      name: 'blank',
      type: 'boolean',
    }),
  ],
})
