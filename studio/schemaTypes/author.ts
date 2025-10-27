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
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Usually just the author name works well for profile pictures',
        },
      ],
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        {name: 'x', title: 'X (Twitter)', type: 'url'},
        {name: 'github', title: 'GitHub', type: 'url'},
        {name: 'etsy', title: 'Etsy', type: 'url'},
        {name: 'twitch', title: 'Twitch', type: 'url'},
        {name: 'youtube', title: 'YouTube', type: 'url'},
        {name: 'instagram', title: 'Instagram', type: 'url'},
        {name: 'linkedin', title: 'LinkedIn', type: 'url'},
        {name: 'website', title: 'Personal Website', type: 'url'},
        {name: 'discord', title: 'Discord Username', type: 'string'},
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
