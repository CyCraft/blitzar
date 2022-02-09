import { computed, ref, ComputedRef, Ref, watch } from 'vue'
import 'blitzar/dist/style.css'
import { getProp } from 'path-to-prop'
import { FilterValue } from '@blitzar/types'
// import { FilterOption, TableInfo } from '../../dbschemas/helpers/tableInfo'

// export type WhereQuery = [string, 'in', (FilterValue)[]]

/**
 * Represents the row counts per filter & value. An object of maps:
 * - Object key — the field ID of the filter
 * - Map key — the value the rows will be filtered by
 * - Map value (number) — the row count based on this value
 *
 * @example
 * ```js
 * // this represents there are 100 profiles with gender 'female'
 * {
 *   gender: Map([
 *     ['female', 100],
 *     ['male', 80],
 *     ['other', 20],
 *     [null, 300],
 *   ])
 * }
 * ```
 */
export type FilterCounts = { [fieldId in string]: Map<FilterValue, number> }

export function useFilters(tableInfo: any): {
  // whereArrays: ComputedRef<WhereQuery[]>
  // filterCounts: ComputedRef<FilterCounts>
} {
  // const whereArrays = computed<WhereQuery[]>(() => {
  //   const wheres: WhereQuery[] = []
  //   for (const [fieldId, map] of Object.entries(filtersState.value)) {
  //     const allShown = [...map.values()].every((v) => v === true)
  //     if (allShown) continue

  //     wheres.push([
  //       fieldId,
  //       'in',
  //       [...map.entries()].filter(([_, bool]) => bool).map(([val]) => val),
  //     ])
  //   }
  //   return wheres
  // })

  /** @see {@link FilterCounts} */
  // const filterCounts = computed<FilterCounts>(() => {
  //   return filterOptions.value.reduce<FilterCounts>((carry, filterOption) => {
  //     const { fieldId, options } = filterOption
  //     const countsMap = new Map<FilterValue, number>()

  //     for (const option of options) {
  //       const query = tableInfo.db.where(fieldId, '==', option.value)
  //       countsMap.set(option.value, query.data.size)
  //     }

  //     carry[fieldId] = countsMap
  //     return carry
  //   }, {})
  // })

  return {
    // whereArrays,
    // filterCounts,
  }
}
