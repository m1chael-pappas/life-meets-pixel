import {
  defineField,
  defineType,
} from 'sanity'

export const newsPostType = defineType({
  name: 'newsPost',
  title: 'News Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'News Title',
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
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: 'Describe the image for SEO and accessibility',
              validation: (rule: any) => rule.required(),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
        {
          type: 'object',
          name: 'divider',
          title: 'Divider',
          fields: [
            {
              name: 'style',
              type: 'string',
              title: 'Style',
              options: {
                list: ['hr'],
              },
              initialValue: 'hr',
            },
          ],
          preview: {
            prepare() {
              return {
                title: '--- Horizontal Rule ---',
              }
            },
          },
        },
        {
          type: 'object',
          name: 'videoEmbed',
          title: 'Video Embed',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'Video URL',
              description: 'YouTube, Vimeo, or direct video file URL',
              validation: (rule: any) => rule.required(),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
          preview: {
            select: {
              url: 'url',
              caption: 'caption',
            },
            prepare({url, caption}: {url: string; caption?: string}) {
              return {
                title: caption || 'Video Embed',
                subtitle: url,
              }
            },
          },
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility. Describe what is in the image.',
          validation: (rule) => rule.required(),
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'category'}]}],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'tag'}]}],
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'breaking',
      title: 'Breaking News',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'featuredImage',
    },
    prepare({title, author, media}) {
      return {
        title,
        subtitle: `by ${author}`,
        media,
      }
    },
  },
})
