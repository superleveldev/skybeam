import {defineField, defineType} from 'sanity'

export const socialNetwork = defineType({
  name: 'socialNetwork',
  title: 'Social Network',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Text',
      type: 'string',
      validation: (Rule) => Rule.required().error('Text is required'),
    }),
    defineField({
      name: 'image',
      title: 'Logo',
      type: 'image',
      options: {
        accept: 'image/svg+xml,image/jpeg,image/png',
      },
      validation: (Rule) =>
        Rule.required()
          .error('Logo is required')
          .custom((image) => {
            const allowedTypes = ['svg', 'jpg', 'jpeg', 'png']
            const fileType = image?.asset?._ref?.split('-').pop()

            if (!fileType) {
              return 'Unable to determine the image type'
            }

            return allowedTypes.includes(fileType)
              ? true
              : `Only ${allowedTypes.join(', ')} images are allowed`
          }),
    }),
    defineField({
      name: 'url',
      title: 'Url',
      type: 'url',
      validation: (Rule) =>
        Rule.required()
          .error('Url is required')
          .uri({
            scheme: ['http', 'https'],
          }),
    }),
  ],
})
