import {
  defineField,
  defineType,
} from 'sanity'

export const platformType = defineType({
  name: 'platform',
  title: 'Platform',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Platform Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Platform Icon',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'manufacturer',
      title: 'Manufacturer',
      type: 'string',
    }),
  ],
})
