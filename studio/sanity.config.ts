import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {colorInput} from '@sanity/color-input'
import {visionTool} from '@sanity/vision'

import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'life-meets-pixel',

  projectId: '1ir3sv5r',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), colorInput()],

  schema: {
    types: schemaTypes,
  },
})
