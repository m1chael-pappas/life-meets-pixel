import {
  defineField,
  defineType,
} from 'sanity'

export const enhancedGenreType = defineType({
  name: 'genre',
  title: 'Genre',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Genre Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'color',
    }),
    defineField({
      name: 'applicableTypes',
      title: 'Applicable Item Types',
      type: 'array',
      of: [
        {
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
        },
      ],
    }),
  ],
})
