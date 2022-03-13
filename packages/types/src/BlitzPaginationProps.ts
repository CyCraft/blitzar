import { PropType } from 'vue'
import { TableMeta } from './table'
import { ExternalProps } from './VueExternalProps'

export const blitzPaginationProps = {
  /**
   * Represents the current open page
   */
  modelValue: { type: Number, required: true },
  /**
   * The total page count for the currently filtered pages based on the `rowsPerPage`
   */
  pageCount: { type: Number, required: true },
  /**
   * BlitzTable will pass the TableMeta which represents the heart of the table state. You can use this freely in your component.
   *
   * TODO: Add information on how to mock the TableMeta prop for development.
   */
  tableMeta: { type: Object as PropType<TableMeta>, default: undefined },
} as const

export type BlitzPaginationProps = ExternalProps<typeof blitzPaginationProps>
