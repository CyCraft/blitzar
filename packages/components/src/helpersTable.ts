import { getProp } from 'path-to-prop'
import { MORE_PAGES } from '@blitzar/types'
import type { DsFilterFields, DsSortby, DsSearchIn, DsSearchAs, DsSortAs } from './typesTable'

export function createPagingRange(nrOfPages: number, currentPage: number) {
  const delta = 2
  const range = []
  const rangeWithDots: (number | typeof MORE_PAGES)[] = []
  let length

  range.push(1)

  if (nrOfPages <= 1) {
    return range
  }

  for (let i = currentPage - delta; i <= currentPage + delta; i++) {
    if (i < nrOfPages && i > 1) {
      range.push(i)
    }
  }
  range.push(nrOfPages)

  for (let i = 0; i < range.length; i++) {
    if (length) {
      if (range[i] - length === 2) {
        rangeWithDots.push(length + 1)
      } else if (range[i] - length !== 1) {
        rangeWithDots.push(MORE_PAGES)
      }
    }
    rangeWithDots.push(range[i])
    length = range[i]
  }
  return rangeWithDots
}

/**
 * @returns a function that can be plugged into `.sort()`
 */
export function fieldSorter(
  dsSortby: DsSortby,
  dsSortAs: DsSortAs = {}
): (a: any, b: any) => number {
  const dir: number[] = []
  let i
  const length = dsSortby.length
  dsSortby = dsSortby.map(function (colId, i) {
    if (colId[0] === '-') {
      dir[i] = -1
      colId = colId.substring(1)
    } else {
      dir[i] = 1
    }
    return colId
  })

  return function (
    rowA: { rowIndex: number; rowData: Record<string, any>; rowDataFlat: Record<string, any> },
    rowB: { rowIndex: number; rowData: Record<string, any>; rowDataFlat: Record<string, any> }
  ) {
    const rowDataA = rowA.rowData
    const rowDataB = rowB.rowData

    for (i = 0; i < length; i++) {
      const colId = dsSortby[i]
      const valueA = getProp(rowDataA, colId)
      const valueB = getProp(rowDataB, colId)
      const sortAsFn = dsSortAs[colId]
      const aVal = sortAsFn ? sortAsFn(valueA, rowDataA) : valueA
      const bVal = sortAsFn ? sortAsFn(valueB, rowDataB) : valueB
      if (aVal > bVal) {
        return dir[i]
      }
      if (aVal < bVal) {
        return -dir[i]
      }
    }
    return 0
  }
}

export function filterRow(
  row: { rowIndex: number; rowData: Record<string, any>; rowDataFlat: Record<string, any> },
  dsFilterFields: DsFilterFields
): boolean {
  const { rowData } = row

  const filterResults = Object.entries(dsFilterFields).map(([colId, filterValueOrFn]) => {
    // get the (nested) value
    const cellValue = getProp(rowData, colId)

    if (typeof filterValueOrFn === 'function') {
      return filterValueOrFn(cellValue, rowData)
    }
    return cellValue === filterValueOrFn
  })

  // the filters currently are chained with `AND`, so check with `.every`
  return filterResults.every((r) => r === true)
}

/**
 * Search method that also takes into account transformations needed
 */
export function findAny(
  dsSearchIn: DsSearchIn,
  dsSearchAs: DsSearchAs,
  row: { rowIndex: number; rowData: Record<string, any>; rowDataFlat: Record<string, any> },
  searchStr: string
): boolean {
  const { rowData, rowDataFlat } = row

  // first check the dsSearchAs functions:
  for (const [colId, searchAsFn] of Object.entries(dsSearchAs)) {
    const notASearchableColId = dsSearchIn.length && !dsSearchIn.includes(colId)
    if (notASearchableColId) continue

    // get the (nested) value
    const cellValue = getProp(rowData, colId)

    if (searchAsFn(cellValue, searchStr, rowData) === true) {
      return true
    }
  }
  // Search didn't hit yet, so let's finally check the entire flat object:

  searchStr = String(searchStr).toLowerCase()

  for (const [key, value] of Object.entries(rowDataFlat)) {
    // check which keys to skip
    const notASearchableKey = dsSearchIn.length && !dsSearchIn.includes(key)
    if (notASearchableKey) continue

    const valueAsStr = String(value).toLowerCase()
    // If it doesn't return from above we perform a simple search
    if (valueAsStr.indexOf(searchStr) >= 0) {
      return true
    }
  }
  // this row is not a hit
  return false
}
