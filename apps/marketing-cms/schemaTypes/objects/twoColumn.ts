import {defineField, defineType} from 'sanity'
import {TWO_COLUMN_TYPES} from './constants'

export const twoColumn = defineType({
  type: 'object',
  name: 'twoColumn',
  title: 'Two Column',
  fields: [
    defineField({
      name: 'content',
      type: 'array',
      title: 'Content',
      of: TWO_COLUMN_TYPES,
    }),
  ],
  preview: {
    select: {
      name: 'name',
    },
    prepare(selection) {
      const {name} = selection
      return {
        title: name ?? 'Two Column',
      }
    },
  },
})
