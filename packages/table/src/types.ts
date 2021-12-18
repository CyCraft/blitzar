/**
 * @see https://next--vue-dataset-demo.netlify.app/components/#props
 */
export type DsScope = {
  /** The data object that contains all the data. */
  dsData: { [id in string]: any }[]
  dsRows: Record<string, any>[]
  /** The array used to create pagination links */
  dsPages: (number | '...')[]
  /** The number of rows currently displaying */
  dsResultsNumber: number
  /** The number of pagination pages */
  dsPagecount: number
  dsShowEntries: number
  /** The item "from" of paginated items currently displaying */
  dsFrom: number
  /** The item "to" of paginated items currently displaying */
  dsTo: number
  /** The number of the current page in pagination */
  dsPage: number
  /** An object containing translation strings */
  datasetI18n: Object
  search: (val: string) => void
  showEntries: (val: number) => Promise<void>
  setActive: (val: number) => void
}
