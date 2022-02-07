<script lang="ts" setup>
import { computed, nextTick, watch } from 'vue'
import { FiltersState, FilterOption, TableMeta, BlitzFilterOptions } from '@blitzar/types'
import { getProp } from 'path-to-prop'

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

const filterOptions = computed<{ fieldId: string; filterLabel: string; options: FilterOption[] }[]>(
  () => {
    return Object.entries(props.filterOptions || {}).map(([fieldId, filterOptions]) => {
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

        const defaultValue = 'defaultValue' in option ? !!option.defaultValue : true
        map.set(option.value, defaultValue)
      }
    })
  },
  { immediate: true }
)

/** // TODO: make it so the setFilter function is debounced per 100ms? At least to detect double-clicks and not emit 3 events in the meantime. */
async function setFilter(
  fieldId: string,
  optionValue: string | number | boolean | null,
  setTo: boolean,
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
        map.set(key, true)
      })
    } else {
      map.forEach((_, key) => {
        map.set(key, false)
      })
    }
  }
  map.set(optionValue, setTo)
}
</script>

<template>
  <div class="blitz-filters">
    <template v-for="f in filterOptions" :key="f.fieldId">
      <div style="padding-right: 1rem">
        <div class="text-caption c-font-medium">
          {{ f.filterLabel }}
        </div>
        <template v-for="option in f.options" :key="option">
          <label
            style="margin-right: 0.5rem"
            @dblclick="() => setFilter(f.fieldId, option.value, true, 'single')"
          >
            <input
              v-if="modelValue[f.fieldId]"
              style="margin-right: 0.25rem"
              type="checkbox"
              :checked="modelValue[f.fieldId].get(option.value) || false"
              @change="(e) => setFilter(f.fieldId, option.value, (e.target as HTMLInputElement)?.checked)"
            />
            <span style="user-select: none">{{ option.label }}</span>
            <!-- ({{ filterCounts[f.fieldId].get(option.value) }}) -->
          </label>
        </template>
      </div>
    </template>
  </div>
</template>

<style lang="scss"></style>
