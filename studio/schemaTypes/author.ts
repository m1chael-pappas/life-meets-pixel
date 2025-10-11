import {
  defineField,
  defineType,
} from 'sanity'

export const authorType = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'avatar',
      title: 'Profile Picture',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        {name: 'twitter', title: 'Twitter', type: 'url'},
        {name: 'twitch', title: 'Twitch', type: 'url'},
        {name: 'youtube', title: 'YouTube', type: 'url'},
        {name: 'discord', title: 'Discord', type: 'string'},
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'avatar',
    },
  },
})
