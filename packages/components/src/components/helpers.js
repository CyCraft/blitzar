import { getProp } from 'path-to-prop'

export function createPagingRange(nrOfPages, currentPage) {
  const delta = 2
  const range = []
  const rangeWithDots = []
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
 * @param {string[]} dsSortby
 * @param {{ [id in string]: (cellValue: any, rowData: Record<string, any>) => any }} dsSortAs
 * @returns {(a: any, b: any) => number} must return a function that can be plugged into `.sort()`
 */
export function fieldSorter(dsSortby, dsSortAs = {}) {
  const dir = []
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

  /**
   * @param {{ rowIndex: number, rowData: Record<string, any>, rowDataFlat: Record<string, any> }} rowA
   * @param {{ rowIndex: number, rowData: Record<string, any>, rowDataFlat: Record<string, any> }} rowB
   */
  return function (rowA, rowB) {
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

/**
 * @param {{ rowIndex: number, rowData: Record<string, any>, rowDataFlat: Record<string, any> }} row
 * @param {{ [colId in string]: (cellValue: any, rowData: Record<string, any>) => boolean | any }} dsFilterFields
 * @returns {boolean}
 */
export function filterRow(row, dsFilterFields) {
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
 * @param {string[]} dsSearchIn
 * @param {{ [id in string]: (cellValue: any, searchString: string, rowData: Record<string, any>) => boolean }} dsSearchAs
 * @param {{ rowIndex: number, rowData: Record<string, any>, rowDataFlat: Record<string, any> }} row
 * @param {string} str the search string
 * @returns {boolean}
 */
export function findAny(dsSearchIn, dsSearchAs, row, str) {
  const { rowData, rowDataFlat } = row

  // first check the dsSearchAs functions:
  for (const [colId, searchAsFn] of Object.entries(dsSearchAs)) {
    const notASearchableColId = dsSearchIn.length && !dsSearchIn.includes(colId)
    if (notASearchableColId) continue

    // get the (nested) value
    const cellValue = getProp(rowData, colId)

    if (searchAsFn(cellValue, str, rowData) === true) {
      return true
    }
  }
  // Search didn't hit yet, so let's finally check the entire flat object:

  str = String(str).toLowerCase()

  for (const [key, value] of Object.entries(rowDataFlat)) {
    // check which keys to skip
    const notASearchableKey = dsSearchIn.length && !dsSearchIn.includes(key)
    if (notASearchableKey) continue

    const valueAsStr = String(value).toLowerCase()
    // If it doesn't return from above we perform a simple search
    if (valueAsStr.indexOf(str) >= 0) {
      return true
    }
  }
  // this row is not a hit
  return false
}
