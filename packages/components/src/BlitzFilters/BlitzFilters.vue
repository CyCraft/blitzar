<script lang="ts" setup>
import { Merge } from 'type-fest'
import { isNumber, isDate } from 'is-what'
import { computed, markRaw, nextTick, ref, watch } from 'vue'
import {
  FiltersState,
  FilterOption,
  TableMeta,
  BlitzFilterOptions,
  FilterValue,
  FilterOptionAuto,
  BlitzFieldProps,
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

type Checkbox = Merge<FilterOption, { op: '===' | '!==' }>
type Range = Merge<FilterOption, { op: '>' | '<'; type: 'number' | 'date' | 'text' }>

// local state
const checkboxes = ref<{ [fieldId in string]: Checkbox[] }>({})
const ranges = ref<{ [fieldId in string]: Range[] }>({})
const combinedFieldIds = computed<string[]>(() => {
  return [...new Set([...Object.keys(checkboxes.value), ...Object.keys(ranges.value)])]
})
/**
 * a Set for unique row values detected so far per fieldId
 */
const fieldIdValuesDic = ref<{ [fieldId in string]: Set<any> }>({})

const isCheckbox = (o: FilterOption | FilterOptionAuto | Checkbox): o is Checkbox =>
  !('detectValues' in o) && (!o.op || o.op === '===' || o.op === '!==')
const isRange = (o: FilterOption | FilterOptionAuto): o is Range =>
  !('detectValues' in o) && (o.op === '>' || o.op === '<')
const isAuto = (o: FilterOption | FilterOptionAuto): o is FilterOptionAuto =>
  'detectValues' in o && o.detectValues

// grab options to render locally
// this is important so we don't constantly need to re-render the filters!
for (const [fieldId, options] of Object.entries(props.filterOptions)) {
  for (const option of options) {
    if (isCheckbox(option)) {
      if (!checkboxes.value[fieldId]) checkboxes.value[fieldId] = []
      checkboxes.value[fieldId].push({ ...option, op: option.op || '===' })
    }
    if (isRange(option)) {
      if (!ranges.value[fieldId]) ranges.value[fieldId] = []
      const label = option.op === '<' && !option.label ? '～' : option.label
      ranges.value[fieldId].push({ ...option, type: getOptionType(option.value), label })
    }
    if (isAuto(option)) {
      if (!fieldIdValuesDic.value[fieldId]) {
        fieldIdValuesDic.value[fieldId] = new Set()
      }
    }
  }
}

/**
 * A watcher to detect new options for {@link FilterOptionAuto}
 */
watch(
  props.tableMeta.rows,
  (newRows) => {
    const fieldIds = Object.keys(fieldIdValuesDic.value)
    if (!fieldIds.length) return

    // a Set for unique row values per fieldId
    const newValuesDic = fieldIds.reduce<Record<string, Set<any>>>(
      (dic, fieldId) => ({ ...dic, [fieldId]: new Set() }),
      {}
    )

    // go through the rows once to build out `newValuesDic`
    for (const row of newRows) {
      for (const fieldId of fieldIds) {
        newValuesDic[fieldId].add(getProp(row, fieldId))
      }
    }

    for (const [fieldId, rowCellValues] of Object.entries(newValuesDic)) {
      // set new sets in fieldIdValuesDic
      let existingSet = fieldIdValuesDic.value[fieldId]
      if (!existingSet) {
        existingSet = new Set()
        fieldIdValuesDic.value[fieldId] = existingSet
      }
      // go through the new values
      for (const newValue of rowCellValues) {
        // do nothing if it already exists
        if (existingSet.has(newValue)) continue
        // add only those that didn't exist yet
        existingSet.add(newValue)
        // add new values to checkboxes
        if (!checkboxes.value[fieldId]) checkboxes.value[fieldId] = []
        checkboxes.value[fieldId].push({ value: newValue, op: '===' })
      }
    }
  },
  { immediate: true }
)

/**
 * This function will update the `modelValue` ({@link FilterState}) based on new local checkboxes or ranges.
 */
async function updateModelValueFilterState(
  checkboxesOrRanges: { [fieldId in string]: Checkbox[] } | { [fieldId in string]: Range[] }
) {
  const newFieldIds = Object.keys(checkboxesOrRanges).filter(
    (fieldId) => !props.modelValue[fieldId]
  )
  // set empty maps for new fieldIds
  if (newFieldIds.length) {
    const newMaps = newFieldIds.reduce<FiltersState>(
      (dic, fieldId) => ({
        ...dic,
        [fieldId]: { in: new Set(), 'not-in': new Set(), '>': undefined, '<': undefined },
      }),
      {}
    )
    emit('update:modelValue', { ...props.modelValue, ...newMaps })
    await nextTick()
  }
  // fill modelValue's fieldId with new values
  for (const [fieldId, options] of Object.entries(checkboxesOrRanges)) {
    for (const o of options) {
      const info = props.modelValue[fieldId]
      if (!info.in) info.in = new Set()
      if (!info['not-in']) info['not-in'] = new Set()

      if (isCheckbox(o)) {
        // don't update if it already exists
        if (info.in.has(o.value) || info['not-in'].has(o.value)) continue

        if (o.op === '===') {
          info.in.add(o.value)
          info['not-in'].delete(o.value)
        }
        if (o.op === '!==') {
          info.in.delete(o.value)
          info['not-in'].add(o.value)
        }
      }
      if (isRange(o)) {
        // don't update if it already exists
        if (info[o.op] !== undefined) continue

        if (o.value === Date || o.value === Number) {
          info[o.op] = undefined
        } else {
          info[o.op] = o.value
        }
      }
    }
  }
}

/** A watcher to set the initial values based on the `checkboxes` */
watch(checkboxes, updateModelValueFilterState, { immediate: true })
/** A watcher to set the initial values based on the `ranges` */
watch(ranges, updateModelValueFilterState, { immediate: true })

/** // TODO: make it so the setCheckbox function is debounced per 100ms? At least to detect double-clicks and not emit 3 events in the meantime. */
async function setCheckbox(
  fieldId: string,
  optionValue: FilterValue,
  option?: 'uncheck-others'
): Promise<void> {
  const info = props.modelValue[fieldId]
  if (!info.in) info.in = new Set()
  if (!info['not-in']) info['not-in'] = new Set()

  if (option === 'uncheck-others') {
    const allValues = checkboxes.value[fieldId].map((checkbox) => checkbox.value)
    const optionAlreadySingleSelection = info.in.has(optionValue) && info.in.size === 1
    if (optionAlreadySingleSelection) {
      // let's select everything
      for (const value of allValues) {
        info.in.add(value)
      }
      info['not-in'].clear()
    } else {
      // else let's only select this value
      for (const value of allValues) {
        if (value !== optionValue) info['not-in'].add(value)
      }
      info.in.clear()
      info.in.add(optionValue)
    }
    return
  }
  const wasSelected = info.in.has(optionValue)
  if (wasSelected) {
    info.in.delete(optionValue)
    info['not-in'].add(optionValue)
  } else {
    info.in.add(optionValue)
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
                :checked="modelValue[fieldId].in?.has(option.value)"
                @change="(e) => setCheckbox(fieldId, option.value)"
              />
              <span v-if="t(option.label) || t(option.value)">{{
                t(option.label) || t(option.value)
              }}</span>
            </label>
          </template>
          <!-- ranges -->
          <template v-for="option in ranges[fieldId] || []" :key="option">
            <label class="blitz-filters__option">
              <span v-if="t(option.label)">{{ t(option.label) }}</span>
              <BlitzField
                v-bind="fInput"
                :type="option.type"
                :modelValue="modelValue[fieldId][option.op]"
                @update:modelValue="(newVal: any) => setRangeFilter({ fieldId, newVal, op: option.op })"
              />
            </label>
          </template>
          <!-- ({{ filterCounts[fieldId].get(option.value) }}) -->
        </div>
      </div>
    </template>
  </div>
</template>

<style>
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
}
.blitz-filters__option {
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
}
.blitz-filters__option span:first-child {
  user-select: none;
  margin-right: 0.5rem;
}
.blitz-filters__option span:last-child {
  user-select: none;
  margin-left: 0.25rem;
}
</style>
