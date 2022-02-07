import { ComputedRef, Ref, WritableComputedRef } from 'vue'
import { FormContext } from './core'
import { AnyRef } from './VueExternalProps'

export const ROW_SELECTION_ID = 'BLITZ-TABLE-ROW-SELECTION' as const

export const MORE_PAGES = '...' as const

/**
 * Represents a filter. An object of maps:
 * - Object key — the field ID you want to filter
 * - Map key — the value you want to filter this field by
 * - Map value (boolean) — `true` if we want to filter by this value
 *
 * @example
 * ```js
 * // filter all with gender 'female'
 * {
 *   gender: Map([
 *     ['female', true],
 *     ['male', false],
 *     ['other', false],
 *     [null, false],
 *   ])
 * }
 * ```
 */
export type FiltersState = { [fieldId in string]: Map<string | number | boolean | null, boolean> }

export type SortState = { id: string; direction: 'asc' | 'desc' }[]

export type TableMeta = {
  /**
   * The original BlitzTable rows as passed to BlitzTable. Non-sorted/filtered/searched.
   */
  rows: AnyRef<Record<string, unknown>[]>
  /**
   * The BlitzTable lang object from the props. Defaults to an empty object.
   */
  lang: AnyRef<Record<string, string>>
  /**
   * The sort state
   */
  sortState: WritableComputedRef<SortState>
  /**
   * The filters state
   */
  filtersState: WritableComputedRef<FiltersState>
  /**
   * The user input in the search field
   */
  searchValue: WritableComputedRef<string>
  /**
   * The amount of rows per page you want to show
   */
  rowsPerPage: WritableComputedRef<number>
  /**
   * The number of the current page in pagination
   */
  pageNr: WritableComputedRef<number>
  /**
   * The visible row indexes of the current page
   */
  pageRowIndexes: ComputedRef<number[]>
  /**
   * The array used to create pagination links
   */
  pageLinks: ComputedRef<(number | '...')[]>
  /**
   * The total number of rows, not filtered data
   */
  totalRowCount: ComputedRef<number>
  /**
   * The number of rows for the current filtered data
   */
  rowCount: ComputedRef<number>
  /**
   * The number of pagination pages for the current filtered data
   */
  pageCount: ComputedRef<number>
  /**
   * The item "from" of paginated items for the current filtered/sorted data
   */
  fromIndex: ComputedRef<number>
  /**
   * The item "to" of paginated items for the current filtered/sorted data
   */
  toIndex: ComputedRef<number>
}

export type SearchablePropIds = string[]

/**
 * `parseValue` dic per column ID. Only used for sorting.
 */
export type ParseValueDic = {
  [id in string]: (cellValue: any, context: FormContext) => any
}
