import {authorType} from './author'
import {categoryType} from './category'
import {enhancedGenreType} from './genre'
import {newsPostType} from './newPost'
import {platformType} from './platform'
import {reviewType} from './review'
import {reviewableItemType} from './reviewableItem'
import {seoType} from './seo'
import {tagType} from './tag'

export const schemaTypes = [
  // NEW: Universal review system (add these)
  reviewableItemType,
  reviewType,
  enhancedGenreType,

  // Main content types
  newsPostType,

  // Reference types (keep these)
  authorType,
  categoryType,
  platformType,
  tagType,

  // Object types
  seoType,
]
