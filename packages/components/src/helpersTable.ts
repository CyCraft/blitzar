import { getProp } from 'path-to-prop'
import { MORE_PAGES } from '@blitzar/types'
import type { FilterFns, SearchablePropIds, ParseValueDic, SortState } from './typesTable'
import { isFullArray } from 'is-what'

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
export function sortFactory(
  sortStateArr: SortState[],
  parseValueDic: ParseValueDic = {}
): (a: any, b: any) => number {
  let i
  const length = sortStateArr.length
  const dir: number[] = sortStateArr.map(function (sortState, i) {
    if (sortState.direction === 'desc') {
      return -1
    } else {
      return 1
    }
  })

  return function (
    rowA: { rowIndex: number; rowData: Record<string, any>; rowDataFlat: Record<string, any> },
    rowB: { rowIndex: number; rowData: Record<string, any>; rowDataFlat: Record<string, any> }
  ) {
    const rowDataA = rowA.rowData
    const rowDataB = rowB.rowData

    for (i = 0; i < length; i++) {
      const colId = sortStateArr[i].id || ''
      const valueA = getProp(rowDataA, colId)
      const valueB = getProp(rowDataB, colId)
      const sortAsFn = parseValueDic[colId]
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
  filterFns: FilterFns
): boolean {
  const { rowData } = row

  const filterResults = Object.entries(filterFns).map(([colId, filterValueOrFn]) => {
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

function checkColumn(payload: {
  searchStr: string
  colId: string
  rowData: Record<string, any>
  parseValueDic: ParseValueDic
}): boolean {
  const { searchStr, colId, rowData, parseValueDic } = payload
  // get the (nested) value
  const cellValue = getProp(rowData, colId)

  // check the non-parsed value
  const resNonParsed = String(cellValue).toLowerCase().indexOf(searchStr) >= 0
  if (resNonParsed) return true

  // do we have a parseValue function?
  const parseValue = parseValueDic[colId]
  if (!parseValue) return false

  // check the parsed value
  try {
    const parsedValue = parseValue(cellValue, { formData: rowData })
    const resParsed = String(parsedValue).toLowerCase().indexOf(searchStr) >= 0
    if (resParsed) return true
  } catch (error) {
    return false
  }
  return false
}

/**
 * Search method that also takes into account transformations needed
 */
export function isRowSearchHit(payload: {
  searchStr: string
  row: { rowIndex: number; rowData: Record<string, any>; rowDataFlat: Record<string, any> }
  searchablePropIds: SearchablePropIds
  parseValueDic: ParseValueDic
}): boolean {
  const { searchStr, row, searchablePropIds, parseValueDic } = payload
  const { rowData, rowDataFlat } = row

  // define in which columns/props we will need to search
  const colIds = isFullArray(searchablePropIds) ? searchablePropIds : Object.keys(rowDataFlat)
  // limit search only to these IDS
  for (const colId of colIds) {
    const result = checkColumn({
      searchStr: String(searchStr).toLowerCase(),
      colId,
      rowData,
      parseValueDic,
    })
    if (result === true) {
      return true
    }
  }
  // this row is not a hit
  return false
}
