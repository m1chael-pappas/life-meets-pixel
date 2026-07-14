import {
  defineField,
  defineType,
} from 'sanity'

const STATUS_EMOJI: Record<string, string> = {
  proposed: '📡',
  approved: '✅',
  skipped: '⏭',
  drafted: '📝',
  published: '🌐',
  posted: '📣',
  failed: '⚠️',
}

export const storyCandidateType = defineType({
  name: 'storyCandidate',
  title: 'Story Candidate',
  type: 'document',
  description: 'Pipeline state for the automated news radar → Telegram → publish flow',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Primary Source URL',
      type: 'url',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sourceName',
      title: 'Primary Source Name',
      type: 'string',
    }),
    defineField({
      name: 'alsoCoveredBy',
      title: 'Also Covered By',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'storyType',
      title: 'Story Type',
      type: 'string',
      options: {
        list: [
          {title: 'Breaking', value: 'breaking'},
          {title: 'News', value: 'news'},
          {title: 'Preview', value: 'preview'},
          {title: 'Feature', value: 'feature'},
        ],
      },
      initialValue: 'news',
    }),
    defineField({
      name: 'pillLabel',
      title: 'Category Pill Label',
      type: 'string',
      description: 'Label shown on the social template pill, e.g. "Gaming News", "Anime News"',
    }),
    defineField({
      name: 'status',
      title: 'Pipeline Status',
      type: 'string',
      options: {
        list: [
          {title: 'Proposed', value: 'proposed'},
          {title: 'Approved (draft it)', value: 'approved'},
          {title: 'Skipped', value: 'skipped'},
          {title: 'Drafted (awaiting publish approval)', value: 'drafted'},
          {title: 'Published', value: 'published'},
          {title: 'Posted to socials', value: 'posted'},
          {title: 'Failed', value: 'failed'},
        ],
      },
      initialValue: 'proposed',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'suggestedAuthor',
      title: 'Suggested Author',
      type: 'string',
      options: {
        list: [
          {title: 'Michael', value: 'michael'},
          {title: 'Jenna', value: 'jenna'},
        ],
      },
      initialValue: 'michael',
    }),
    defineField({
      name: 'imageNeeded',
      title: 'Needs Manual Image',
      type: 'boolean',
      description: 'Set when automatic promo image sourcing failed; cleared when an image is dropped in via Telegram',
      initialValue: false,
    }),
    defineField({
      name: 'promoImage',
      title: 'Promo Image',
      type: 'image',
      description: 'Sourced automatically from press assets, or dropped in via Telegram reply',
      options: {hotspot: true},
    }),
    defineField({
      name: 'newsPostId',
      title: 'News Post Document ID',
      type: 'string',
      description: 'Set once the drafting agent creates the newsPost draft',
      readOnly: true,
    }),
    defineField({
      name: 'telegramMessageId',
      title: 'Telegram Message ID',
      type: 'number',
      description: 'The Telegram card for this candidate, so the bot can update it',
      readOnly: true,
    }),
    defineField({
      name: 'proposedAt',
      title: 'Proposed At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'headline',
      status: 'status',
      sourceName: 'sourceName',
    },
    prepare({title, status, sourceName}) {
      return {
        title: `${STATUS_EMOJI[status] || ''} ${title}`,
        subtitle: `${status}${sourceName ? ` · ${sourceName}` : ''}`,
      }
    },
  },
})
