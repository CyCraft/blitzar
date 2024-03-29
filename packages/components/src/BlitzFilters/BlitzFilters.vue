<script lang="ts" setup>
import { isNumber, isDate } from 'is-what'
import { computed, markRaw, nextTick, ref, watch } from 'vue'
import {
  FiltersState,
  TableMeta,
  BlitzFilterOptions,
  FilterValue,
  BlitzFieldProps,
  isCheckbox,
  isRange,
  isAuto,
  isAdvanced,
  Checkbox,
  Range,
  FilterOptionAdvanced,
  CompareFn,
} from '@blitzar/types'
import { getProp } from 'path-to-prop'
import BlitzField from '../BlitzField/BlitzField.vue'
import BlitzInput from '../BlitzInput/BlitzInput.vue'

const props = defineProps<{
  /**
   * Must use with v-model
   */
  modelValue: FiltersState
  filterOptions: BlitzFilterOptions
  tableMeta: TableMeta
  inputField?: BlitzFieldProps
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', payload: FiltersState): void
}>()

const fInput = props.inputField || { component: markRaw(BlitzInput) }

// helpers
function getOptionType(payload: any): 'number' | 'date' | 'text' {
  if (isNumber(payload) || payload === Number) return 'number'
  if (isDate(payload) || payload === Date) return 'date'
  return 'text'
}

// local state
const checkboxes = ref<{ [fieldId in string]: Checkbox[] }>({})
const ranges = ref<{ [fieldId in string]: Range[] }>({})
const advanced = ref<{ [fieldId in string]: FilterOptionAdvanced[] }>({})
const combinedFieldIds = computed<string[]>(() => {
  return [
    ...new Set([
      ...Object.keys(checkboxes.value),
      ...Object.keys(ranges.value),
      ...Object.keys(advanced.value),
    ]),
  ]
})
/**
 * a Set for unique row values detected so far per fieldId
 *
 * `Map<any, number>` represents
 * - `any` — the value found
 * - `number` — the amount of times it is present
 */
const fieldIdInfoDic = ref<{ [fieldId in string]: Map<any, number> }>({})

// grab options to render locally
// this is important so we don't constantly need to re-render the filters!
for (const [fieldId, options] of Object.entries(props.filterOptions)) {
  for (const option of options) {
    if (isAuto(option)) {
      // setup
      if (!checkboxes.value[fieldId]) checkboxes.value[fieldId] = []
      if (!fieldIdInfoDic.value[fieldId]) fieldIdInfoDic.value[fieldId] = new Map()
      continue
    }
    if (isAdvanced(option)) {
      if (!advanced.value[fieldId]) advanced.value[fieldId] = []
      advanced.value[fieldId].push(option)
      // setup
      continue
    }
    if (isCheckbox(option)) {
      // setup
      if (!checkboxes.value[fieldId]) checkboxes.value[fieldId] = []
      if (!fieldIdInfoDic.value[fieldId]) fieldIdInfoDic.value[fieldId] = new Map()
      // add option
      checkboxes.value[fieldId].push({ ...option, op: option.op || '===' })
      fieldIdInfoDic.value[fieldId].set(option.value, 0)
      continue
    }
    if (isRange(option)) {
      // setup
      if (!ranges.value[fieldId]) ranges.value[fieldId] = []
      // add option
      const label = option.op === '<' && !option.label ? '～' : option.label
      ranges.value[fieldId].push({ ...option, type: getOptionType(option.value), label })
      continue
    }
  }
}

function calculateCheckboxesAndCounts() {
  const fieldIds = Object.keys(fieldIdInfoDic.value)

  // we will go through all the rows again so reset the counts once
  for (const fieldId of fieldIds) {
    for (const [foundValue] of fieldIdInfoDic.value[fieldId]) {
      fieldIdInfoDic.value[fieldId].set(foundValue, 0)
    }
  }

  // go through the rows once to build out `fieldIdInfoDic`
  for (const row of props.tableMeta.rows.value) {
    for (const fieldId of fieldIds) {
      const foundValue: any = getProp(row, fieldId)
      let count: undefined | number = fieldIdInfoDic.value[fieldId].get(foundValue)
      // is it a new value?
      if (!isNumber(count)) {
        fieldIdInfoDic.value[fieldId].set(foundValue, 0)
        count = 0
        // add new values to checkboxes
        if (!checkboxes.value[fieldId]) checkboxes.value[fieldId] = []
        checkboxes.value[fieldId].push({ value: foundValue, op: '===' })
      }
      // increment the count!
      fieldIdInfoDic.value[fieldId].set(foundValue, count + 1)
    }
  }
}

const debounce = ref<ReturnType<typeof setTimeout>>(setTimeout(() => {}, 0))
/**
 * A watcher to detect new options for {@link FilterOptionAuto}
 */
watch(
  props.tableMeta.rows,
  () => {
    clearTimeout(debounce.value)
    debounce.value = setTimeout(calculateCheckboxesAndCounts, 1000)
  },
  { immediate: true }
)

/**
 * This function will update the `modelValue` ({@link FilterState}) based on new local checkboxes or ranges.
 */
async function updateModelValueFilterState(
  checkboxesOrRanges:
    | { [fieldId in string]: Checkbox[] }
    | { [fieldId in string]: Range[] }
    | { [fieldId in string]: FilterOptionAdvanced[] }
) {
  // fill modelValue's fieldId with new values
  for (const [fieldId, options] of Object.entries(checkboxesOrRanges)) {
    let info = props.modelValue[fieldId]
    // setup the modelValue
    if (!info) {
      info = {
        in: new Set(),
        'not-in': new Set(),
        '>': undefined,
        '<': undefined,
        custom: new Map(),
      }
      emit('update:modelValue', { ...props.modelValue, [fieldId]: info })
      await nextTick() // required to prevent emitting incorrect modelValue
    }
    if (!info['in']) info['in'] = new Set()
    if (!info['not-in']) info['not-in'] = new Set()
    if (!info.custom) info.custom = new Map()

    // add checkboxes and ranges to modelValue
    for (const o of options) {
      // add checkboxes
      if (isCheckbox(o)) {
        // don't update if it already exists
        if (info['in'].has(o.value) || info['not-in'].has(o.value)) continue

        if (o.op === '===') {
          info['in'].add(o.value)
          info['not-in'].delete(o.value)
        }
        if (o.op === '!==') {
          info['in'].delete(o.value)
          info['not-in'].add(o.value)
        }
      }
      // add ranges
      if (isRange(o)) {
        // don't update if it already exists
        if (info[o.op] !== undefined) continue

        if (o.value === Date || o.value === Number) {
          info[o.op] = undefined
        } else {
          info[o.op] = o.value
        }
      }
      // add advanced
      if (isAdvanced(o)) {
        // don't update if it already exists
        if (info.custom.has(o.compareFn)) continue

        info.custom.set(o.compareFn, o.defaultValue)
      }
    }
  }
}

/** A watcher to set the initial values based on the `checkboxes` */
watch(checkboxes, updateModelValueFilterState, { immediate: true })
/** A watcher to set the initial values based on the `ranges` */
watch(ranges, (newRanges) => setTimeout(() => updateModelValueFilterState(newRanges), 1), {
  immediate: true,
}) // delay one to prevent incorrect emit('update:modelValue')
/** A watcher to set the initial values based on the `advanced` */
watch(
  advanced,
  (newComponents) => setTimeout(() => updateModelValueFilterState(newComponents), 2),
  { immediate: true }
) // delay one to prevent incorrect emit('update:modelValue')

/** // TODO: make it so the setCheckbox function is debounced per 100ms? At least to detect double-clicks and not emit 3 events in the meantime. */
async function setCheckbox(
  fieldId: string,
  optionValue: FilterValue,
  option?: 'uncheck-others'
): Promise<void> {
  const info = props.modelValue[fieldId]
  if (!info['in']) info['in'] = new Set()
  if (!info['not-in']) info['not-in'] = new Set()

  if (option === 'uncheck-others') {
    const allValues = checkboxes.value[fieldId].map((checkbox) => checkbox.value)
    const optionAlreadySingleSelection = info['in'].has(optionValue) && info['in'].size === 1
    if (optionAlreadySingleSelection) {
      // let's select everything
      for (const value of allValues) {
        info['in'].add(value)
      }
      info['not-in'].clear()
    } else {
      // else let's only select this value
      for (const value of allValues) {
        if (value !== optionValue) info['not-in'].add(value)
      }
      info['in'].clear()
      info['in'].add(optionValue)
    }
    return
  }
  const wasSelected = info['in'].has(optionValue)
  if (wasSelected) {
    info['in'].delete(optionValue)
    info['not-in'].add(optionValue)
  } else {
    info['in'].add(optionValue)
    info['not-in'].delete(optionValue)
  }
}

async function setRangeFilter(payload: {
  fieldId: string
  newVal: FilterValue
  op: '>' | '<'
}): Promise<void> {
  const { fieldId, newVal, op } = payload
  const info = props.modelValue[fieldId]
  info[op] = newVal
}

async function setAdvancedFilter(payload: {
  fieldId: string
  newVal: any
  compareFn: CompareFn
}): Promise<void> {
  const { fieldId, newVal, compareFn } = payload
  const info = props.modelValue[fieldId]['custom']
  if (info) {
    info.set(compareFn, newVal)
  }
}

function t(payload: any): string {
  return props.tableMeta.lang.value[`${payload}`] || (payload ? `${payload}` : '')
}
</script>

<template>
  <div class="blitz-filters">
    <template v-for="fieldId in combinedFieldIds" :key="fieldId">
      <div class="blitz-filters__section">
        <div class="blitz-filters__field-label" style="">
          {{ t(fieldId) }}
        </div>
        <div v-if="modelValue[fieldId]" class="blitz-filters__controls">
          <!-- checkboxes -->
          <template v-for="option in checkboxes[fieldId] || []" :key="option">
            <label
              class="blitz-filters__option"
              @dblclick.stop="() => setCheckbox(fieldId, option.value, 'uncheck-others')"
            >
              <input
                type="checkbox"
                :checked="modelValue[fieldId]['in']?.has(option.value)"
                @change="(e) => setCheckbox(fieldId, option.value)"
              />
              <span v-if="t(option.label) || t(option.value)" class="_label"
                >{{ t(option.label) || t(option.value)
                }}<span v-if="fieldIdInfoDic[fieldId]?.get(option.value)" class="_count"
                  >({{ fieldIdInfoDic[fieldId]?.get(option.value) }})</span
                ></span
              >
            </label>
          </template>
          <!-- ranges -->
          <template v-for="option in ranges[fieldId] || []" :key="option">
            <label class="blitz-filters__option">
              <span v-if="t(option.label)" class="_label">{{ t(option.label) }}</span>
              <BlitzField
                v-bind="fInput"
                :type="option.type"
                :modelValue="modelValue[fieldId][option.op]"
                @update:modelValue="(newVal: any) => setRangeFilter({ fieldId, newVal, op: option.op })"
              />
            </label>
          </template>
          <!-- advanced -->
          <template v-for="(field, i) in advanced[fieldId] || []" :key="i">
            <label class="blitz-filters__option">
              <span v-if="t(field.label)" class="_label">{{ t(field.label) }}</span>
              <BlitzField
                v-bind="field"
                :label="undefined"
                :modelValue="modelValue[fieldId]['custom']?.get(field.compareFn)"
                @update:modelValue="(newVal: any) => setAdvancedFilter({ fieldId, newVal, compareFn: field.compareFn })"
              />
            </label>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.blitz-filters {
  display: flex;
  flex-wrap: wrap;
}
.blitz-filters__section {
  padding-right: 1rem;
  padding-bottom: 1rem;
}
.blitz-filters__field-label {
  padding-bottom: 0.5rem;
  line-height: 1;
}
.blitz-filters__controls {
  display: flex;
  flex-wrap: wrap;
}
.blitz-filters__option {
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}
.blitz-filters__option ._label:first-child {
  user-select: none;
  margin-right: 0.5rem;
}
.blitz-filters__option ._label:last-child {
  user-select: none;
  margin-left: 0.25rem;
}
.blitz-filters__option ._label ._count {
  margin-left: 0.4rem;
}
</style>
