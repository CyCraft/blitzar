import { ExternalProps } from './VueExternalProps'

export const blitzPaginationProps = {
  /** Represents the current open page */
  modelValue: { type: Number, required: true },
  /** The total page count for the currently filtered pages based on the `rowsPerPage` */
  pageCount: { type: Number, required: true },
} as const

export type BlitzPaginationProps = ExternalProps<typeof blitzPaginationProps>
