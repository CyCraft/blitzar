<template>
  <QTable
    class="blitz-table"
    v-bind="qTableProps"
    :selected.sync="cSelected"
    :pagination.sync="pagination"
    v-on="$listeners"
  >
    <template v-slot:top v-if="usesTopSlot">
      <slot name="above-nav-row" />
      <div class="blitz-table__nav-row">
        <slot name="top-left">
          <div class="q-table__title" v-if="title">{{ title }}</div>
        </slot>
        <slot name="top-right">
          <BlitzBtn
            v-for="btn in cActionButtons"
            :key="btn.btnLabel"
            v-bind="btn"
            v-on="btn.events"
          />
        </slot>
      </div>
      <slot name="above-table" />
    </template>
    <!-- Pass on all scoped slots -->
    <template
      v-for="slot in Object.keys($scopedSlots).filter((slot) => !slot.includes('top'))"
      v-slot:[slot]="scope"
    >
      <slot :name="slot" v-bind="scope" />
    </template>

    <template v-slot:body="rowProps">
      <BlitzForm
        :class="
          [
            'blitz-table__row',
            'blitz-row',
            `blitz-row__${rowProps.row.id}`,
            evaluate(rowClasses, rowProps.row),
          ].flat()
        "
        :style="evaluate(rowStyle, rowProps.row)"
        :formComponent="QTr"
        :schema="schemaColumns"
        :value="rowProps.row"
        :id="rowProps.row.id"
        :mode="mode"
        :key="rowProps.row.id + JSON.stringify(rowProps.row)"
        @fieldInput="({ id, value, origin }) => onInputCell(rowProps.row.id, id, value, origin)"
      >
        <template v-slot="blitzFormCtx">
          <QTd v-if="selectionMode" auto-width>
            <div class="flex flex-center">
              <q-checkbox :dense="true" v-model="rowProps.selected" />
            </div>
          </QTd>
          <QTd
            v-for="colBlueprint in blitzFormCtx.schema"
            :key="colBlueprint.id"
            :props="rowProps"
            :class="['blitz-cell', evaluate(colBlueprint.cellClasses, rowProps.row)].flat()"
            :style="evaluate(colBlueprint.cellStyle, rowProps.row)"
            @click="(e) => onCellClick(e, rowProps.row, colBlueprint.id)"
            @dblclick="(e) => onCellDblclick(e, rowProps.row, colBlueprint.id)"
          >
            <!-- somehow an extra div is required otherwise buttons won't render properly -->
            <div>
              <BlitzField
                v-bind="{ ...colBlueprint, span: undefined, label: undefined, subLabel: undefined }"
                :value="blitzFormCtx.formDataFlat[colBlueprint.id]"
                @input="(val, origin) => onInputCell(rowProps.row.id, colBlueprint.id, val, origin)"
              />
            </div>
          </QTd>
        </template>
      </BlitzForm>
    </template>
    <!-- Grid item -->
    <template v-slot:item="gridItemProps">
      <slot name="item" v-bind="gridItemProps">
        <QCard
          v-if="schemaGrid"
          :class="
            [
              'blitz-table__grid-item',
              gridItemProps.selected ? 'selected' : [],
              evaluate(cardClass, gridItemProps),
            ].flat()
          "
          :style="evaluate(cardStyle, gridItemProps)"
          @click="(e) => onRowClick(e, gridItemProps.row, 'grid', gridItemProps)"
        >
          <BlitzForm
            :key="gridItemProps.row.id + JSON.stringify(gridItemProps.row)"
            :value="gridItemProps.row"
            :id="gridItemProps.row.id"
            v-bind="gridBlitzFormProps"
            @fieldInput="
              ({ id: fieldId, value, origin }) =>
                onInputCell(gridItemProps.row.id, fieldId, value, origin)
            "
          />
        </QCard>
      </slot>
    </template>
  </QTable>
</template>

<style lang="sass">
@import '../index.sass'

.blitz-table
  display: flex
  flex-direction: column
  th
    white-space: pre
  .q-table__top
    display: flex
    flex-wrap: nowrap
    flex-direction: column
    align-items: stretch
  &.q-table--grid .q-table__middle
    min-height: 0
    margin-bottom: 0
.blitz-table__nav-row
  display: grid
  justify-content: stretch
  align-content: start
  align-items: center
  grid-gap: $md
  grid-auto-flow: column
  grid-template-columns: 1fr
.blitz-table__grid-item
  margin: $sm
  padding: $md
  transition: all 200ms
  .blitz-field__sub-label
    display: none
  &.selected
    background: #efefef
    transform: scale(0.9)
</style>

<script>
import { merge } from 'merge-anything'
import { isPlainObject, isFunction } from 'is-what'
import { QTable, QTr, QTd, QCheckbox, QCard } from 'quasar'
import { BlitzForm, BlitzField, BlitzBtn } from '@blitzar/form'
import schemaToQTableColumns from '../helpers/schemaToQTableColumns.js'

/**
 * @typedef GridCardProps
 * @type {object}
 * @property {any} key - Row's key
 * @property {object} row - Row object
 * @property {number} rowIndex - Row's index (0 based) in the filtered and sorted table
 * @property {number} pageIndex - Row's index (0 based) in the current page of the filtered and sorted table
 * @property {object} cols - Column definitions
 * @property {object} colsMap - Column mapping (key is column name, value is column object)
 * @property {boolean} selected - (reactive prop) Is row selected? Can directly be assigned new Boolean value which changes selection state"
 * @property {boolean} expand - (reactive prop) Is row expanded? Can directly be assigned new Boolean value which changes expanded state"
 * @property {string} __trClass - Internal prop passed down to QTr (if used)
 */

export default {
  name: 'BlitzTable',
  inheritAttrs: false,
  components: {
    QTable,
    QTr,
    QTd,
    QCheckbox,
    QCard,
    BlitzBtn,
    BlitzForm,
    BlitzField,
  },
  props: {
    /**
     * The schema for the columns you want to generate. (BlitzForm schema format)
     * @type {{[key in string]: any}[]}
     * @example [{ id: 'nameFirst', label: 'First Name', component: 'input' }, { id: 'nameLast', label: 'Last Name', component: 'input' }]
     * @category column
     */
    schemaColumns: { type: Array, required: true },
    /**
     * The schema for the grid cards you want to generate. (BlitzForm schema format)
     * @example [{ id: 'nameFirst', label: 'First Name', component: 'input' }, { id: 'nameLast', label: 'Last Name', component: 'input' }]
     * @category column
     */
    schemaGrid: { type: [Array, Object] },
    /**
     * Rows of data to display. Use `rows` instead of the QTables `data`. Renamed for clarity.
     * @type {{[key in string]: any}[]}
     * @example [{ nameFirst: 'Eleanor', nameLast: 'Shellstrop' }, { nameFirst: 'Chidi', nameLast: 'Anagonye' }]
     * @category model
     */
    rows: { type: Array, required: true },
    /**
     * Action buttons to add to the table. These can be pre-set buttons you can add by passing a string, or custom ones by passing an object with {label, handler}.
     *
     * Preset buttons include:
     * - 'add'
     * - 'grid'
     * - 'selection:duplicate' (this just does `$emit('duplicate', selectionArray)`, you must implement your own logic.
     * @example ['add', 'grid', { btnLabel: 'do it', events: { click: console.log } }]
     * @category content
     */
    actionButtons: { type: Array, default: () => ['grid'] },
    /**
     * The BlitzForm options you want to use for the grid cards.
     *
     * Please note:
     * - The 'schema' should be set via the 'schemaGrid' prop.
     * - 'value' and 'id' are set automatically.
     * - These are the default values, but they can be overridden: `{ actionButtons: [] }`
     * - See the documentation of BlitzForm for more information on available props.
     * @category column
     */
    gridBlitzFormOptions: { type: Object, default: () => ({}) },
    /**
     * The text used in the UI, eg. the 'add new record' buttons etc... Pass an object with keys: ....
     * @category content
     */
    lang: { type: Object, default: () => ({ add: 'Add new', duplicate: 'Duplicate' }) }, // when updating this, be sure to also update "innerLang"
    /**
     * Custom styling to be applied to each row. Applied like so `:style="rowStyle"`
     * @example 'padding: 1em;'
     * @category style
     */
    rowStyle: { type: [Object, Array, String, Function] },
    /**
     * Custom classes to be applied to each row. Applied like so `:class="rowClasses"`
     * @example ['dark-theme']
     * @category style
     */
    rowClasses: { type: [Object, Array, String, Function] },
    // Inherited props used here:
    /**
     * @category inherited prop
     */
    grid: { type: Boolean, default: false },
    /**
     * @category inherited prop
     */
    selected: { type: Array, default: () => [] },
    /**
     * CSS classes to apply to the card (when in grid mode).
     * You can pass a function which will be evaluated just like an evaluated prop. The first param passed will be the entire row data. The second is `item` scoped slot object from a QTable.
     * @type {(rowData: Record<string, any>, gridCardProps: GridCardProps, BlitzTableContext: any) => string | Record<string, any> | (string | Record<string, any>)[]}
     * @example 'special-class'
     * @example :card-class="{ 'my-special-class': [Boolean condition] }"
     * @category inherited prop
     */
    cardClass: { type: [Function, String, Array, Object] },
    /**
     * CSS style to apply to the card (when in grid mode).
     * You can pass a function which will be evaluated just like an evaluated prop. The first param passed will be the entire row data. The second is `item` scoped slot object from a QTable.
     * @type {(rowData: Record<string, any>, gridCardProps: GridCardProps, BlitzTableContext: any) => string | Record<string, any> | (string | Record<string, any>)[]}
     * @example 'background-color: #ff0000'
     * @example :card-style="{ backgroundColor: '#ff0000' }"
     * @category inherited prop
     */
    cardStyle: { type: [Function, String, Array, Object] },
    /**
     * By default the rows show just the raw data without showing field components. If you set `mode: 'edit'` your entire table will show the actual (editable) component as per your schema.
     * @category content
     */
    mode: { type: String, default: 'raw' },
    // Inherited props with different defaults:
    // Modified inherited props:
    /**
     * Use `rows` instead of the QTables `data`. Renamed for clarity.
     * @category modified prop
     */
    data: { type: Array },
    /**
     * Do not use this! Use `schemaColumns` instead. This is the prop QTable uses to define its columns. BlitzTable uses `schemaColumns` instead.
     * @category modified prop
     */
    columns: {},
    /**
     * A title to be placed above your table.
     * @category modified prop
     */
    title: { type: String },
    /**
     * This is fixed to `id` in a BlitzTable and cannot be changed.
     * @category modified prop
     */
    rowKey: {},
  },
  created() {
    // some validation on creation
    const needsSchemaGrid = this.grid === true || this.actionButtons.includes('grid')
    if (needsSchemaGrid && this.schemaGrid === undefined) {
      throw new Error(
        '[BlitzTable] You need to defined a prop called "schemaGrid" if you want to use a grid layout as well!'
      )
    }
  },
  data() {
    const { lang, grid, selected } = this
    // merge user provided lang onto defaults
    const innerSelected = selected
    // when updating this, be sure to also update the "lang" prop
    const innerLang = merge({ add: 'Add new', duplicate: 'Duplicate' }, lang)
    const innerGrid = grid
    // const innerFilter = filter
    return {
      // innerFilter,
      innerSelected,
      innerLang,
      innerGrid,
      defaultPagination: {
        rowsPerPage: 10,
      },
      QTr,
    }
  },
  watch: {
    grid(newValue) {
      this.innerGrid = newValue
    },
    selected(newValue) {
      this.innerSelected = newValue
    },
  },
  computed: {
    selectionMode() {
      const { qTableProps } = this
      return qTableProps.selection === 'single' || qTableProps.selection === 'multiple'
    },
    pagination: {
      get() {
        return this.qTableProps.pagination || this.defaultPagination
      },
      set(newPagination) {
        if (this.qTableProps.pagination) {
          return this.$emit('update:pagination', newPagination)
        }
        this.defaultPagination = newPagination
      },
    },
    usesTopSlot() {
      const { title, cActionButtons, $scopedSlots: slot } = this
      return (
        title ||
        cActionButtons.length ||
        slot['above-table'] ||
        slot['above-nav-row'] ||
        slot['top-left'] ||
        slot['top-right']
      )
    },
    qTableProps() {
      const propsOnlyUsedInSlots = ['cardStyle', 'cardClass']
      const propsToNotPass = propsOnlyUsedInSlots
        .reduce((carry, key) => ({ ...carry, [key]: undefined }), {}) // prettier-ignore
      return merge(
        this.$attrs,
        {
          // Quasar props with modified behavior:
          data: this.rows,
          columns: this.cColumns,
          rowKey: 'id',
          grid: this.innerGrid,
          // Quasar props with modified defaults:
          // filter: this.$attrs.filter || this.innerFilter,
          // Quasar props just to pass:
        },
        propsToNotPass
      )
    },
    gridBlitzFormProps() {
      const { gridBlitzFormOptions, schemaGrid, mode } = this
      const defaults = {
        schema: schemaGrid,
        mode,
      }
      return merge(defaults, gridBlitzFormOptions)
    },
    cSelected: {
      get() {
        return this.innerSelected
      },
      set(val) {
        this.innerSelected = val
        this.$emit('update:selected', val)
      },
    },
    cColumns() {
      return schemaToQTableColumns(this.schemaColumns)
    },
    cActionButtons() {
      const {
        actionButtons,
        innerLang,
        tapAdd,
        tapDuplicate,
        cSelected,
        innerGrid,
        enableGrid,
        disableGrid,
        schemaGrid,
      } = this
      const blitzTableContext = this
      return actionButtons
        .map((btn) => {
          if (btn === 'grid' && schemaGrid) {
            // return // 以下の機能は未完成
            return innerGrid
              ? { icon: 'view_list', flat: true, events: { click: disableGrid } }
              : { icon: 'view_module', flat: true, events: { click: enableGrid } }
          }
          if (cSelected.length) {
            if (btn === 'selection:duplicate') {
              return {
                btnLabel: innerLang['duplicate'],
                push: true,
                events: { click: tapDuplicate },
              }
            }
          }
          if (!cSelected.length) {
            if (btn === 'add') {
              return { btnLabel: innerLang['add'], push: true, events: { click: tapAdd } }
            }
          }
          if (isPlainObject(btn)) {
            if (!isPlainObject(btn.events)) return btn
            const { click } = btn.events
            if (isFunction(click)) btn.events.click = (val) => click(val, blitzTableContext)
            return btn
          }
        })
        .filter((btn) => isPlainObject(btn))
    },
  },
  methods: {
    evaluate(propValue, rowProps) {
      if (!isFunction(propValue)) return propValue
      return propValue(rowProps.row, rowProps, this)
    },
    enableGrid() {
      this.innerGrid = true
    },
    disableGrid() {
      this.innerGrid = false
    },
    tapAdd() {
      this.$emit('add')
    },
    tapDuplicate() {
      this.$emit('duplicate', this.cSelected)
    },
    onCellDblclick(event, rowData, colId) {
      this.$emit('row-dblclick', event, rowData)
      this.$emit('cell-dblclick', event, rowData, colId)
    },
    onCellClick(event, rowData, colId) {
      this.onRowClick(event, rowData)
      this.$emit('cell-click', event, rowData, colId)
    },
    onRowClick(event, rowData, origin, gridItemProps) {
      const { selectionMode } = this
      if (origin === 'grid' && selectionMode) {
        gridItemProps.selected = !gridItemProps.selected
      }
      this.$emit('row-click', event, rowData)
    },
    onInputCell(rowId, colId, value, origin) {
      this.$emit('input-cell', { rowId, colId, value, origin })
    },
  },
}
</script>
