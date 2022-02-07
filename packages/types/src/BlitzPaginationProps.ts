import { PropType } from 'vue'
import { ExternalProps } from './VueExternalProps'
import { TableMeta } from './table'

export const blitzPaginationProps = {
  /** Represents the current open page */
  modelValue: { type: Number, required: true },
  tableMeta: { type: Object as PropType<TableMeta>, required: true },
} as const

export type BlitzPaginationProps = ExternalProps<typeof blitzPaginationProps>
