<script lang="ts" setup>
import { isNumber, isDate, isMap } from 'is-what'
import { computed, nextTick, ref, watch } from 'vue'
import {
  FiltersState,
  FilterOption,
  TableMeta,
  BlitzFilterOptions,
  FilterValue,
} from '@blitzar/types'
import { getProp } from 'path-to-prop'
import { copy } from 'copy-anything'

const props = defineProps<{
  /**
   * Must use with v-model
   */
  modelValue: FiltersState
  filterOptions: BlitzFilterOptions
  tableMeta: TableMeta
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', payload: FiltersState): void
}>()

const filterOptionsCopy = ref(copy(props.filterOptions) || {})

const filterOptions = computed<{ fieldId: string; filterLabel: string; options: FilterOption[] }[]>(
  () => {
    return Object.entries(filterOptionsCopy.value).map(([fieldId, filterOptions]) => {
      const filterLabel = props.tableMeta.lang.value[fieldId] || fieldId

      let options: FilterOption[] = filterOptions.filter(
        (o): o is FilterOption => !('detectValues' in o) || !o.detectValues
      )
      const filterOptionsAuto = filterOptions.filter(
        (o): o is FilterOption => 'detectValues' in o && o.detectValues
      )

      if (filterOptionsAuto.length) {
        // add options based on the rows
        const rowCellValues = new Set<any>()
        for (const row of props.tableMeta.rows.value) {
          const cellValue = getProp(row, fieldId)
          rowCellValues.add(cellValue)
        }
        rowCellValues.forEach((value) => {
          options.push({ label: `${value}`, value: value })
        })
      }

      options = options.map((o) => ({
        ...o,
        label: props.tableMeta.lang.value[`${o.value}`] || o.label,
      }))

      return { fieldId, filterLabel, options }
    })
  }
)

// set the initial values based on the `filterOptions`
watch(
  filterOptions,
  async (newVal) => {
    const newFieldIds = newVal
      .map(({ fieldId }) => fieldId)
      .filter((fieldId) => !props.modelValue[fieldId])
    if (newFieldIds.length) {
      const newMaps = newFieldIds.reduce<FiltersState>(
        (dic, fieldId) => ({ ...dic, [fieldId]: new Map() }),
        {}
      )
      emit('update:modelValue', { ...props.modelValue, ...newMaps })
      await nextTick()
    }
    newVal.forEach(({ fieldId, options }) => {
      const map = props.modelValue[fieldId]

      for (const option of options) {
        if (map.has(option.value)) continue

        const defaultOperation = option.op || '==='
        map.set(option.value, defaultOperation)
      }
    })
  },
  { immediate: true }
)

/** // TODO: make it so the setInclusionFilter function is debounced per 100ms? At least to detect double-clicks and not emit 3 events in the meantime. */
async function setInclusionFilter(
  fieldId: string,
  optionValue: FilterValue,
  setTo: '===' | '!==' | '<' | '>',
  option = ''
): Promise<void> {
  await nextTick()
  const map = props.modelValue[fieldId]
  if (option === 'single') {
    const optionAlreadySingleSelection = [...map.entries()].every(
      ([key, value]) => (key === optionValue && value) || (key !== optionValue && !value)
    )
    if (optionAlreadySingleSelection) {
      map.forEach((_, key) => {
        map.set(key, '===')
      })
    } else {
      map.forEach((_, key) => {
        map.set(key, '!==')
      })
    }
  }
  map.set(optionValue, setTo)
}

async function setRangeFilter(
  fieldId: string,
  oldValue: FilterValue,
  newValue: FilterValue,
  op: '<' | '>'
): Promise<void> {
  await nextTick()
  const map = props.modelValue[fieldId]
  map.set(newValue, op)
  map.delete(oldValue)
  // we actually also need to update the `filterOptionsCopy` in this case!
  const filterOption = filterOptionsCopy.value[fieldId]
  const oldOption: any = filterOption.find((o) => 'value' in o && o.value === oldValue)
  if (oldOption) (oldOption as any).value = newValue
}
</script>

<template>
  <div class="blitz-filters">
    <!-- <pre>{{ filterOptions }}</pre>
    <pre>{{ modelValue }}</pre> -->
    <template v-for="f in filterOptions" :key="f.fieldId">
      <div style="padding-right: 1rem">
        <div class="text-caption c-font-medium">
          {{ f.filterLabel }}
        </div>
        <template v-for="option in f.options" :key="option">
          <label
            style="margin-right: 0.5rem"
            @dblclick="() => setInclusionFilter(f.fieldId, option.value, '===', 'single')"
          >
            <template v-if="modelValue[f.fieldId]">
              <input
                v-if="['===', '!=='].includes(modelValue[f.fieldId].get(option.value) as any)"
                style="margin-right: 0.25rem"
                type="checkbox"
                :checked="modelValue[f.fieldId].get(option.value) === '===' || false"
                @change="(e) => setInclusionFilter(f.fieldId, option.value, (e.target as HTMLInputElement)?.checked ? '===' : '!==')"
              />
              <span style="user-select: none">{{ option.label }}</span>
              <input
                v-if="['<', '>'].includes(modelValue[f.fieldId].get(option.value) as any)"
                style="margin-left: 0.25rem"
                :type="isNumber(option.value) ? 'number' : isDate(option.value) ? 'date' : 'text'"
                :value="option.value"
                @input="(e) => setRangeFilter(f.fieldId, option.value, (e.target as HTMLInputElement)?.value, modelValue[f.fieldId].get(option.value) as any)"
              />
              <!-- ({{ filterCounts[f.fieldId].get(option.value) }}) -->
            </template>
          </label>
        </template>
      </div>
    </template>
  </div>
</template>

<style lang="scss"></style>
