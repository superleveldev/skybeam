import {defineType} from 'sanity'

export const richText = defineType({
  name: 'richText',
  title: 'Rich Text',
  type: 'object',
  fields: [
    {
      name: 'richTextContent',
      title: 'Rich Text',
      type: 'blockContent',
    },
  ],
  preview: {
    select: {
      richTextContent: 'richTextContent',
    },
    prepare({richTextContent}) {
      const firstBlock = richTextContent[0].children[0].text
      return {
        title: firstBlock || 'Rich Text',
        subtitle: 'Rich Text',
      }
    },
  },
})
