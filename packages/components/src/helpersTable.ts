import { getProp } from 'path-to-prop'
import { isDate, isFullArray, isNumber, isPositiveNumber, isSet, isString } from 'is-what'
import {
  MORE_PAGES,
  SearchablePropIds,
  ParseValueDic,
  SortState,
  FiltersState,
  FilterValue,
  getFilterEntries,
} from '@blitzar/types'

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

export function shouldFilterRows(filtersState: FiltersState): boolean {
  return Object.values(filtersState).some(
    (info) =>
      isPositiveNumber(info['not-in']?.size) || info['>'] !== undefined || info['<'] !== undefined
  )
}

/**
 * @returns a function that can be plugged into `.sort()`
 */
export function sortFactory(
  sortStateArr: SortState,
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
    for (i = 0; i < length; i++) {
      const colId = sortStateArr[i].id || ''
      const valueA: any = getProp(rowA.rowData, colId)
      const valueB: any = getProp(rowB.rowData, colId)
      const parseFn = parseValueDic[colId]
      let aVal = valueA
      let bVal = valueB
      if (parseFn) {
        try {
          // TODO: make sure that the proper FormContext is passed here
          aVal = parseFn(valueA, { formData: rowA.rowData, formDataFlat: rowA.rowDataFlat } as any)
        } catch (e) {/** */} // prettier-ignore
        try {
          // TODO: make sure that the proper FormContext is passed here
          bVal = parseFn(valueB, { formData: rowB.rowData, formDataFlat: rowB.rowDataFlat } as any)
        } catch (e) {/** */} // prettier-ignore
      }
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

function compare(
  a: any,
  op: 'in' | 'not-in' | '<' | '>',
  b: FilterValue | Set<FilterValue>
): boolean {
  if (op === 'in') {
    if (!isSet(b) || b.size === 0) return true
    return b.has(a as any)
  }
  if (op === 'not-in') {
    if (!isSet(b) || b.size === 0) return true
    return !b.has(a as any)
  }

  if (isDate(b)) a = new Date(a)
  if (isNumber(b)) a = Number(a)
  if (isString(b)) a = String(a)

  if (op === '>') {
    if (!isString(b) && !isNumber(b) && !isDate(b)) return true
    return (a as any) > b
  }
  if (op === '<') {
    if (!isString(b) && !isNumber(b) && !isDate(b)) return true
    return (a as any) < b
  }
  return false
}

export function isRowFilterHit(payload: {
  filtersState: FiltersState
  row: { rowIndex: number; rowData: Record<string, any>; rowDataFlat: Record<string, any> }
  parseValueDic: ParseValueDic
}): boolean {
  const { filtersState, row, parseValueDic } = payload

  return Object.entries(filtersState).every(([fieldId, info]) => {
    console.log(`========\nfieldId → `, fieldId, '\n========')

    return getFilterEntries(info).every(([op, expectedValue]) => {
      // get the (nested) value
      const cellValue = getProp(row.rowData, fieldId)

      // the cellValue matches the expectedValue
      const passes = compare(cellValue, op, expectedValue)

      console.log(`cellValue → `, cellValue, `| isDate → `, isDate(cellValue))
      console.log(`op → `, op)
      console.log(`expectedValue → `, expectedValue, `| isDate → `, isDate(expectedValue))

      console.log(`passes → `, passes)

      if (passes) return true

      // do we have a parseValue function?
      const parseValue = parseValueDic[fieldId]
      if (!parseValue) {
        // no more checking so we know for sure this expectedValue is not the cellValue
        // so we don't need to check wether or not to include this row, so let's include if it passed:
        return passes
      }

      try {
          // TODO: properly pass FormContext here!!!
        const cellValueParsed: any = parseValue(cellValue, {
          formData: row.rowData,
          formDataFlat: row.rowDataFlat,
        } as any)
        // we successfully got the parsedValue, let's compare again
        return compare(cellValueParsed, op, expectedValue)
      } catch (e) {/***/} // prettier-ignore

      // if we didn't get the cellValueParsed we can just fall back to the original passed result
      return passes
    })
  })
}

function isColumnSearchHit(payload: {
  searchStr: string
  colId: string
  row: { rowIndex: number; rowData: Record<string, any>; rowDataFlat: Record<string, any> }
  parseValueDic: ParseValueDic
}): boolean {
  const { searchStr, colId, row, parseValueDic } = payload
  // get the (nested) value
  const cellValue = getProp(row.rowData, colId)

  // check the non-parsed value
  const resNonParsed = String(cellValue).toLowerCase().indexOf(searchStr) >= 0
  if (resNonParsed) return true

  // do we have a parseValue function?
  const parseValue = parseValueDic[colId]
  if (!parseValue) return false

  // check the parsed value
  try {
    // TODO: properly pass FormContext here!!!
    const parsedValue = parseValue(cellValue, {
      formData: row.rowData,
      formDataFlat: row.rowDataFlat,
    } as any)
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

  // define in which columns/props we will need to search
  const colIds = isFullArray(searchablePropIds) ? searchablePropIds : Object.keys(row.rowDataFlat)
  // limit search only to these IDS
  for (const colId of colIds) {
    const result = isColumnSearchHit({
      searchStr: String(searchStr).toLowerCase(),
      colId,
      row,
      parseValueDic,
    })
    if (result === true) {
      return true
    }
  }
  // this row is not a hit
  return false
}
