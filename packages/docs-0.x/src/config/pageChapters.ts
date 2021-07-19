import { ROUTE_NAMES } from '../router/routes'

/**
 * (optional) If you want to pass extra props to either the `ExampleSection` or `MarkdownSection` you can do so with the filename from `chapterOrder` as key and the props as value.
 */
export const chapterOptions: Record<string, Record<string, any>> = {
  'Frameworks - Vuetify.vue': { iframe: 'https://blitzar-vuetify.web.app', iframeHeight: '1280px' },
}

export const routeNamePageChaptersMap: { [key in ROUTE_NAMES]: string[] } = {
  [ROUTE_NAMES.FORM]: [
    'Basics.md',
    'Basics - Basic Example.vue',
    'Basics - Advanced Example.vue',
    'Frameworks.md',
    'Frameworks - Quasar Framework.vue',
    'Frameworks - Vuetify.md',
    'Frameworks - Vuetify.vue',
    'Slots.md',
    'Slots - Default.vue',
    'Slots - Label.vue',
    'Modes.vue',
    'Modes - Disable Fields on View Mode.vue',
    'Action Buttons.md',
    'Action Buttons - Pre-Made Action Buttons.vue',
    'Action Buttons - Overwriting Pre-Made Action Buttons.vue',
    'Action Buttons - Custom Action Buttons.vue',
    'Form Data.md',
    'Form Data - Clearing the Form.vue',
    'Form Data - Resetting the Form.vue',
    'Form Data - Nested Data.vue',
    'Form Data - List Forms.vue',
    'Styling.md',
    'Styling - Left Labels.vue',
    'Styling - Custom Label Positioning.vue',
    'Styling - Raw Form Styling.vue',
    'Events.md',
    'Events - Form Events.vue',
    'Events - Field Events.vue',
    'Events - Update Other Fields on Events.vue',
    'Evaluated Props.md',
    'Evaluated Props - 1.vue',
    'Evaluated Props - 2.vue',
    'Evaluated Props - 3.vue',
    'Evaluated Props - 4.vue',
    'Evaluated Props - 5.vue',
    'Computed Fields.md',
    'Computed Fields - 1.vue',
    'Computed Fields - 2.vue',
    'Computed Fields - 3.vue',
    'Validation.vue',
    'Validation - 2.vue',
  ],
  [ROUTE_NAMES.TABLE]: [
    'Basics.md',
    'Basics - Basic Example.vue',
    'Advanced.vue',
    'Computed Columns.vue',
    'Editing.md',
    'Editing - On Button Click.vue',
    'Editing - On Row Click.vue',
    'Editing - Inline.vue',
    'Editing - Inline on Cell Double-Click.vue',
    'Editing - Adding a New Record.vue',
    'Search and Filter.vue',
    'Selection.vue',
    'Selection - Styling.vue',
    'Selection - Search.vue',
    'Slots.vue',
    'Styling.md',
    'Styling - Via CSS.vue',
    'Styling - Row Hover Color.md',
    'Styling - Reusable Complex Styling.vue',
    'Styling - Via Props.vue',
  ],
  [ROUTE_NAMES.LIST_FORM]: [
    'Basics.md',
    'Basics - Basic Example.vue',
    'Basics - Advanced Example.vue',
    'Basics - Multi-Row Example.vue',
    'BlitzForm Example.vue',
  ],
}