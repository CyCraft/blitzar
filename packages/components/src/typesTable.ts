import type { BlitzFieldProps } from '@blitzar/types'

export type BlitzColumnProps = {
  /** Defaults to `true` */
  sortable?: boolean
}

export type BlitzColumn = BlitzFieldProps & BlitzColumnProps

// anything below is internal state related

export type SortState = { id: null | string; direction: 'asc' | 'desc' | 'none' }

export type TableMeta = {
  /**
   * All the indexes of the rows make up the filtered/sorted data
   *
   * (inside of BlitzTableOuter uses `Ref<number[]>`)
   */
  currentIndexes: number[]
  /**
   * The visible row indexes of the current page
   *
   * (inside of BlitzTableOuter uses `ComputedRef<number[]>`)
   */
  shownRows: number[]
  /**
   * The array used to create pagination links
   *
   * (inside of BlitzTableOuter uses `ComputedRef<(number | '...')[]>`)
   */
  shownPageIndexes: (number | '...')[]
  /**
   * The number of rows currently displaying
   *
   * (inside of BlitzTableOuter uses `ComputedRef<number>`)
   */
  currentResultsCount: number
  /**
   * The number of pagination pages
   *
   * (inside of BlitzTableOuter uses `ComputedRef<number>`)
   */
  currentPageCount: number
  /**
   * The amount of rows per page you want to show
   *
   * (inside of BlitzTableOuter uses `Ref<number>`)
   */
  rowsPerPage: number
  /**
   * The item "from" of paginated items currently displaying
   *
   * (inside of BlitzTableOuter uses `ComputedRef<number>`)
   */
  shownFrom: number
  /**
   * The item "to" of paginated items currently displaying
   *
   * (inside of BlitzTableOuter uses `ComputedRef<number>`)
   */
  shownTo: number
  /**
   * The number of the current page in pagination
   *
   * (inside of BlitzTableOuter uses `Ref<number>`)
   */
  currentPageNr: number
  /** Execute on text input in the search field */
  search: (val: string) => void
  /** Execute to change the amount of visible rows */
  setRowsPerPage: (val: number) => Promise<void>
  /** Execute to change the current opened page */
  setPageNr: (val: number) => void
}

export type FilterFns = {
  [colId in string]: (cellValue: any, rowData: Record<string, any>) => boolean | any
}

export type SearchablePropIds = string[]

/**
 * `parseValue` dic per column ID. Only used for sorting.
 */
export type ParseValueDic = {
  [id in string]: (cellValue: any, rowData: Record<string, any>) => any
}
