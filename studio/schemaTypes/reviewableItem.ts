import {
  defineField,
  defineType,
} from 'sanity'

export const reviewableItemType = defineType({
  name: 'reviewableItem',
  title: 'Reviewable Item',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
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
      name: 'itemType',
      title: 'Item Type',
      type: 'string',
      options: {
        list: [
          {title: 'Video Game', value: 'videogame'},
          {title: 'Board Game', value: 'boardgame'},
          {title: 'Movie', value: 'movie'},
          {title: 'TV Series', value: 'tvseries'},
          {title: 'Anime', value: 'anime'},
          {title: 'Book', value: 'book'},
          {title: 'Comic/Manga', value: 'comic'},
          {title: 'Gadget/Tech', value: 'gadget'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'releaseDate',
      title: 'Release Date',
      type: 'date',
    }),
    defineField({
      name: 'creator',
      title: 'Creator/Developer/Director',
      type: 'string',
    }),
    defineField({
      name: 'publisher',
      title: 'Publisher/Studio/Network',
      type: 'string',
    }),
    // Type-specific fields (conditional based on itemType)
    defineField({
      name: 'platforms',
      title: 'Platforms',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'platform'}]}],
      hidden: ({document}) => {
        const itemType = document?.itemType as string
        return itemType !== 'videogame'
      },
    }),
    defineField({
      name: 'esrbRating',
      title: 'ESRB Rating',
      type: 'string',
      options: {
        list: ['E', 'E10+', 'T', 'M', 'AO'],
      },
      hidden: ({document}) => {
        const itemType = document?.itemType as string
        return itemType !== 'videogame'
      },
    }),
    defineField({
      name: 'playerCount',
      title: 'Player Count',
      type: 'string',
      placeholder: 'e.g., 2-4 players',
      hidden: ({document}) => {
        const itemType = document?.itemType as string
        return itemType !== 'boardgame'
      },
    }),
    defineField({
      name: 'playTime',
      title: 'Play Time',
      type: 'string',
      placeholder: 'e.g., 30-60 minutes',
      hidden: ({document}) => {
        const itemType = document?.itemType as string
        return itemType !== 'boardgame'
      },
    }),
    defineField({
      name: 'runtime',
      title: 'Runtime',
      type: 'string',
      placeholder: 'e.g., 120 minutes',
      hidden: ({document}) => {
        const itemType = document?.itemType as string
        return !['movie', 'anime'].includes(itemType)
      },
    }),
    defineField({
      name: 'seasons',
      title: 'Seasons',
      type: 'number',
      hidden: ({document}) => {
        const itemType = document?.itemType as string
        return !['tvseries', 'anime'].includes(itemType)
      },
    }),
    defineField({
      name: 'episodes',
      title: 'Episodes',
      type: 'number',
      hidden: ({document}) => {
        const itemType = document?.itemType as string
        return !['tvseries', 'anime'].includes(itemType)
      },
    }),
    defineField({
      name: 'pageCount',
      title: 'Page Count',
      type: 'number',
      hidden: ({document}) => {
        const itemType = document?.itemType as string
        return !['book', 'comic'].includes(itemType)
      },
    }),
    defineField({
      name: 'isbn',
      title: 'ISBN',
      type: 'string',
      hidden: ({document}) => {
        const itemType = document?.itemType as string
        return itemType !== 'book'
      },
    }),
    defineField({
      name: 'genres',
      title: 'Genres',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'genre'}]}],
    }),
    defineField({
      name: 'officialWebsite',
      title: 'Official Website',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      itemType: 'itemType',
      media: 'coverImage',
    },
    prepare({title, itemType, media}) {
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
        title,
        subtitle: `${typeEmojis[itemType as string] || '📦'} ${itemType}`,
        media,
      }
    },
  },
})
