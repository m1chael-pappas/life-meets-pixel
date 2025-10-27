import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '1ir3sv5r',
    dataset: 'production',
  },
  studioHost: 'lmp',
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  deployment: {autoUpdates: true},
})
