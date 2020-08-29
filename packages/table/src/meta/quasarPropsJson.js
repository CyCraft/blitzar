import { copy }from 'copy-anything'
import { camelCase } from 'case-anything'
import { isArray } from 'is-what'
import QTableJson from 'quasar/dist/api/QTable.json'

const stringToTypeFnDictionary = {
  Object: Object,
  Function: Function,
  Array: Array,
  String: String,
  Number: Number,
  Boolean: Boolean,
  RegExp: RegExp,
  Date: Date,
  Symbol: Symbol,
}
const stringToTypeFn = string => stringToTypeFnDictionary[string]

function jsonToPropFormat ({ props }) {
  if (!props) return {}
  return Object.entries(props).reduce((carry, [key, value]) => {
    value = copy(value)
    value.inheritedProp = true
    value.type = isArray(value.type) ? value.type.map(stringToTypeFn) : stringToTypeFn(value.type)
    carry[camelCase(key)] = value
    return carry
  }, {})
}

export const QTable = jsonToPropFormat(QTableJson)

export default {
  QTable,
}
