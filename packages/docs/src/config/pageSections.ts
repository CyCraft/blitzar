import { ROUTE_NAMES } from '../router/routes'

export const routeNamePageSectionsMap: { [key in ROUTE_NAMES]: string[] } = {
  [ROUTE_NAMES.FORM]: [
    'basics',
    'advanced',
    'modes',
    'actionButtons',
    'events1',
    'events2',
    'events3',
    'nestedData',
    'evaluatedProps1',
    'evaluatedProps2',
    'evaluatedProps3',
    'evaluatedProps4',
    'computedFields1',
    'computedFields2',
    'computedFields3',
    'validation1',
    'validation2',
    'slots',
  ],
  [ROUTE_NAMES.TABLE]: [
    'basics',
    'advanced',
    'computedColumns',
    'selection',
    'slots',
    'editOnButtonClick',
    'editOnRowClick',
  ],
}
