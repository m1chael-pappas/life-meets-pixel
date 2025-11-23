import {
  defineField,
  defineType,
} from 'sanity'

export const reviewType = defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Review Title',
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
      name: 'reviewableItem',
      title: 'Item Being Reviewed',
      type: 'reference',
      to: [{type: 'reviewableItem'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'reviewScore',
      title: 'Review Score',
      type: 'number',
      validation: (rule) => rule.required().min(1).max(10),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Review Content',
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
              validation: (rule) => rule.required(),
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
            prepare({url, caption}) {
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
      name: 'pros',
      title: 'Pros',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'cons',
      title: 'Cons',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'verdict',
      title: 'Verdict',
      type: 'text',
      rows: 2,
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
      name: 'featured',
      title: 'Featured Review',
      type: 'boolean',
      initialValue: false,
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
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      itemTitle: 'reviewableItem.title',
      itemType: 'reviewableItem.itemType',
      score: 'reviewScore',
      author: 'author.name',
      media: 'reviewableItem.coverImage',
    },
    prepare({title, itemTitle, itemType, score, author, media}) {
      const typeEmojis: Record<string, string> = {
        videogame: '🎮',
        boardgame: '🎲',
        movie: '🎬',
        tvseries: '📺',
        anime: '🍥',
        book: '📚',
        comic: '📖',
        gadget: '📱',
      }
      return {
        title: `${title} (${score}/10)`,
        subtitle: `${typeEmojis[itemType as string] || '📦'} ${itemTitle} by ${author}`,
        media,
      }
    },
  },
})
