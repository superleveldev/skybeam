import { defineField, defineType } from 'sanity'

export const about = defineType({
    name: 'about',
    title: 'About Us',
    type: 'document',
    fields: [
      defineField({
        name: 'member',
        title: 'Member',
        type: 'array',
        of: [
          {
            type: 'reference',
            to: [{type: 'member'}],
          },
        ],
      }),
    ]
})