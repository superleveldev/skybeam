import {defineField, defineType} from 'sanity'
import {ONE_COLUMN_TYPES} from './constants'

export const oneColumn = defineType({
  type: 'object',
  name: 'oneColumn',
  title: 'One Column',
  fields: [
    defineField({
      name: 'content',
      type: 'array',
      title: 'Content',
      of: ONE_COLUMN_TYPES,
    }),
  ],
  preview: {
    select: {
      name: 'name',
    },
    prepare(selection) {
      const {name} = selection
      return {
        title: name ?? 'One Column',
      }
    },
  },
})
