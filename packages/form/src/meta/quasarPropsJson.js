import { copy } from 'copy-anything'
import { camelCase } from 'case-anything'
import { isArray } from 'is-what'
import QBtnJson from 'quasar/dist/api/QBtn.json'
import QBtnToggleJson from 'quasar/dist/api/QBtnToggle.json'
import QImgJson from 'quasar/dist/api/QImg.json'
import QInputJson from 'quasar/dist/api/QInput.json'
import QRangeJson from 'quasar/dist/api/QRange.json'
import QSelectJson from 'quasar/dist/api/QSelect.json'
import QSliderJson from 'quasar/dist/api/QSlider.json'
import QToggleJson from 'quasar/dist/api/QToggle.json'
import QUploaderJson from 'quasar/dist/api/QUploader.json'
import QVideoJson from 'quasar/dist/api/QVideo.json'

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
const stringToTypeFn = (string) => stringToTypeFnDictionary[string]

function jsonToPropFormat({ props }) {
  if (!props) return {}
  return Object.entries(props).reduce((carry, [key, value]) => {
    value = copy(value)
    value.inheritedProp = true
    value.type = isArray(value.type) ? value.type.map(stringToTypeFn) : stringToTypeFn(value.type)
    carry[camelCase(key)] = value
    return carry
  }, {})
}

export const QBtn = jsonToPropFormat(QBtnJson)
export const QBtnToggle = jsonToPropFormat(QBtnToggleJson)
export const QImg = jsonToPropFormat(QImgJson)
export const QInput = jsonToPropFormat(QInputJson)
export const QRange = jsonToPropFormat(QRangeJson)
export const QSelect = jsonToPropFormat(QSelectJson)
export const QSlider = jsonToPropFormat(QSliderJson)
export const QToggle = jsonToPropFormat(QToggleJson)
export const QUploader = jsonToPropFormat(QUploaderJson)
export const QVideo = jsonToPropFormat(QVideoJson)

export default {
  QBtn,
  QBtnToggle,
  QImg,
  QInput,
  QRange,
  QSelect,
  QSlider,
  QToggle,
  QUploader,
  QVideo,
}
