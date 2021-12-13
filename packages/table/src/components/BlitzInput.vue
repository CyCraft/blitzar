<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Pepicon } from 'vue-pepicons'
import { isFullString, isNumber, isDate } from 'is-what'
import BlitzIcon from './BlitzIcon.vue'

const kind = ['main', 'on-lilac'] as const
type Kind = typeof kind[number]

const type = [
  'text',
  'textarea',
  'select',
  'button',
  'checkbox',
  'color',
  'date',
  'datetime-local',
  'email',
  'file',
  'hidden',
  'image',
  'month',
  'number',
  'password',
  'radio',
  'range',
  'reset',
  'search',
  'submit',
  'tel',
  'time',
  'url',
  'week',
] as const
type Type = typeof type[number]

type Options = { label: string; value: string | number }[]

export default defineComponent({
  name: 'BlitzInput',
  components: { Pepicon, BlitzIcon },
  props: {
    /**
     * The kind of input, slightly changes the looks
     * @category style
     */
    kind: { type: String as PropType<Kind>, default: 'main' },
    /**
     * Pepicon icon name
     * @category content
     */
    icon: { type: String, default: '' },
    /**
     * @category content
     */
    suffix: { type: String, default: '' },
    /**
     * @category content
     */
    prefix: { type: String, default: '' },
    /**
     * Shows an '✅' icon on the right side of the input field.
     * @category content
     */
    showCheck: { type: Boolean, default: false },
    /**
     * Shows an '❌' icon on the right side of the input field.
     * @category content
     */
    hasError: { type: Boolean, default: false },
    /**
     * Shows a loading icon on the right side of the input field.
     * @category content
     */
    isBusy: { type: Boolean, default: false },
    /**
     * HTML5 attribute — with EXCEPTIONS!
     * - Exception: can also be 'textarea' in which case a `<textarea />` is rendered
     * - Exception: can also be 'select' in which case a `<select />` is rendered
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types
     * @category content
     */
    type: { type: String as PropType<Type>, default: 'text' },
    /**
     * Only when `type: 'select'`
     */
    options: { type: Array as PropType<Options>, default: undefined },
    /**
     * HTML5 attribute
     * @category content
     */
    placeholder: { type: String, default: undefined },
    /**
     * HTML5 attribute
     * @category state
     */
    disabled: { type: [Boolean, String], default: undefined },
    /**
     * HTML5 attribute
     * @category state
     */
    readonly: { type: [Boolean, String], default: undefined },
    /**
     * HTML5 attribute
     * @category validation
     */
    required: { type: [Boolean, String], default: undefined },
    /**
     * HTML5 attribute
     * @category feature
     */
    autocomplete: { type: [Boolean, String], default: undefined },
    /**
     * HTML5 attribute
     * @category feature
     */
    min: { type: String, default: undefined },
    /**
     * HTML5 attribute (only for type="textarea")
     * @category style
     */
    rows: { type: [String, Number], default: '3' },
    /**
     * v-model
     * @category content
     */
    modelValue: { type: [String, Number, Date], default: '' },
    /**
     * @category feature
     */
    autofocus: { type: Boolean, default: false },
    /**
     * @category feature
     */
    autogrow: { type: Boolean, default: false },
    /**
     * @category feature
     */
    debounce: { type: Number, default: 0 },
    /**
     * @category feature
     */
    clearable: { type: Boolean, default: false },
    /**
     * @category feature
     */
    preventFocus: { type: Boolean, default: false },
  },
  emits: ['click', 'update:modelValue', 'blur', 'focus', 'enter'],
  data() {
    return {
      selectId: Math.random().toString(),
      textareaHeight: 'unset',
      timeout: 0,
      valueInner: this.parseValue(this.modelValue),
      fieldType: this.type,
      eyeSvg: 'eye-closed',
      textareaObserver: null as null | IntersectionObserver,
    }
  },
  computed: {
    iconCalculated() {
      const { icon, type } = this
      if (icon) return icon
      if (type === 'search') return 'loop'
      if (type === 'date') return 'calendar'
      return ''
    },
  },
  watch: {
    type(newVal) {
      this.fieldType = newVal
    },
    modelValue(newVal) {
      const { valueInner, parseValue } = this
      if (newVal !== valueInner) {
        this.valueInner = parseValue(newVal)
      }
    },
    valueInner(newVal) {
      this.autogrowInput()
      const debounceMs = this.debounce
      if (debounceMs > 0) {
        clearTimeout(this.timeout as any)
        this.timeout = setTimeout(() => this.emitInput(newVal), debounceMs) as any
      } else {
        this.emitInput(newVal)
      }
    },
  },
  mounted() {
    if (this.valueInner) {
      // only autogrow on mount when there's input
      // otherwise it will not adhere to eg. `rows="3"` on empty textareas
      this.autogrowInput({ init: true })
    }
    if (this.autofocus) {
      // temporarily delayed by 400ms to cope with the broken animation
      // right after opening a fullscreen modal.
      // see: https://colorfulcasting.atlassian.net/browse/blitz-1432

      setTimeout(() => this.focus(), 400)
    }
  },
  beforeUnmount() {
    this.textareaObserver?.disconnect()
  },
  methods: {
    parseValue(val: Date | string) {
      const { type } = this
      if (type !== 'date' || !isDate(val)) return val

      const YYYY = String(val.getFullYear()).padStart(4, '0')
      const MM = String(val.getMonth() + 1).padStart(2, '0')
      const DD = String(val.getDate()).padStart(2, '0')
      return `${YYYY}-${MM}-${DD}`
    },
    emitInput(newVal: number | Date | string) {
      const { type } = this
      let payload = newVal
      if (isFullString(newVal)) {
        if (type === 'number' && isNumber(Number(newVal))) {
          payload = Number(newVal)
        }
        if (type === 'date' && isDate(new Date(newVal))) {
          payload = new Date(newVal)
        }
      }
      this.$emit('update:modelValue', payload)
    },
    focus(e?: Event) {
      if (this.preventFocus) {
        this.$emit('click', e)
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur()
        }
        return
      }
      const ref = this.$refs['native-el'] as HTMLElement
      if (ref) ref.focus()
    },
    click(e: Event) {
      if (this.type !== 'date' || (this.type === 'date' && this.preventFocus)) {
        e.preventDefault()
        e.stopPropagation()
      }
      this.focus(e)
    },
    autogrowInput(options?: Record<'init', boolean>) {
      const textAreaRef = this.$refs['native-el'] as HTMLElement
      if (!!textAreaRef && this.type === 'textarea' && this.autogrow) {
        if (options?.init) this.registerTextareaObserver()
        this.textareaHeight = 'auto'
        this.$nextTick(() => {
          if (this.valueInner && textAreaRef.scrollHeight !== textAreaRef.clientHeight) {
            this.textareaHeight = `${textAreaRef.scrollHeight}px`
          }
        })
      }
    },
    registerTextareaObserver() {
      if (this.textareaObserver) return
      this.textareaObserver = new IntersectionObserver(
        (entries) => entries[0].isIntersecting && this.autogrowInput()
      )
      this.textareaObserver.observe(this.$refs['native-el'] as HTMLElement)
    },
    toggleVisiblity() {
      this.eyeSvg = this.eyeSvg === 'eye-closed' ? 'eye' : 'eye-closed'
      this.fieldType = this.fieldType === 'text' ? 'password' : 'text'
      if (document.activeElement === this.$refs['native-el']) {
        window.requestAnimationFrame(() => this.focus())
      }
    },
    clearInput() {
      this.valueInner = ''
      if (document.activeElement === this.$refs['native-el']) {
        window.requestAnimationFrame(() => this.focus())
      }
    },
  },
})
</script>

<template>
  <div
    :class="`blitz-input _kind-${kind} _type-${type} ${disabled ? '_disabled' : ''} ${
      !!valueInner ? '_truthy' : '_falsy'
    } ${showCheck || hasError || isBusy ? '_has-icon-right' : ''}`"
    @click.stop="(e) => focus(e)"
  >
    <div v-if="prefix" class="_prefix mr-xs">{{ prefix }}</div>
    <Pepicon
      v-if="iconCalculated"
      class="_icon mr-xs"
      size="20px"
      type="pop"
      :name="iconCalculated"
    />
    <input
      v-if="type !== 'textarea' && type !== 'select'"
      ref="native-el"
      v-model="valueInner"
      :disabled="disabled || undefined"
      :type="fieldType"
      :placeholder="placeholder || (type === 'search' ? '検索' : undefined)"
      :readonly="readonly"
      :required="required"
      :autocomplete="autocomplete"
      :min="min"
      data-cy="input-field"
      @click="click"
      @blur="(e) => $emit('blur', e)"
      @focus="(e) => $emit('focus', e)"
      @keypress.enter="(e) => $emit('enter', e)"
    />
    <textarea
      v-if="type === 'textarea'"
      ref="native-el"
      v-model="valueInner"
      :style="`${String(rows) === '1' ? 'resize: none' : ''}; height: ${textareaHeight}`"
      :rows="rows"
      :disabled="disabled || undefined"
      :placeholder="placeholder"
      :readonly="readonly"
      :required="required"
      :autocomplete="autocomplete"
      data-cy="input-field"
      @click="click"
      @blur="(e) => $emit('blur', e)"
      @focus="(e) => $emit('focus', e)"
      @keypress.enter="(e) => $emit('enter', e)"
    />
    <label v-if="type === 'select'" class="_select-wrapper">
      <select
        ref="native-el"
        v-model="valueInner"
        :disabled="disabled || undefined"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        data-cy="select-field"
        @click="click"
        @blur="(e) => $emit('blur', e)"
        @focus="(e) => $emit('focus', e)"
        @keypress.enter="(e) => $emit('enter', e)"
      >
        <option v-if="placeholder" value="">{{ placeholder }}</option>
        <option v-for="option in options" :key="option.label" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <Pepicon class="_icon ml-xs _select-arrow" size="20px" type="pop" name="angle-down" />
    </label>
    <slot />
    <div v-if="suffix" class="_suffix ml-xs">{{ suffix }}</div>
    <div v-if="showCheck || hasError || isBusy" class="ml-auto pl-sm">
      <BlitzIcon v-if="isBusy" kind="loading" />
      <BlitzIcon v-else-if="hasError" kind="error" />
      <BlitzIcon v-else-if="showCheck" kind="synced" />
    </div>
    <button
      v-if="type === 'password'"
      type="button"
      class="ml-auto pl-sm _eye"
      @mousedown="toggleVisiblity"
    >
      <Pepicon type="pop" :name="eyeSvg" class="_eye" />
    </button>
    <button
      v-if="(clearable || type === 'search') && valueInner"
      type="button"
      class="ml-auto pl-sm _cross"
      @mousedown="clearInput"
    >
      <Pepicon type="pop" name="times" />
    </button>
  </div>
</template>

<style lang="sass">
=reset-button()
  padding: 0
  background: none
  border: none
  &:hover
    cursor: pointer
  &:focus
    outline: 0

/** Global Styles */
.blitz-input
  --c-primary: #0b3d92
  --c-border: #dfe2e5
  min-width: 0
  max-width: 100%
  display: flex
  flex-wrap: nowrap
  align-items: center
  position: relative
  padding: 0.5rem
  &._disabled
    opacity: 0.7 !important
    cursor: not-allowed !important
  textarea, input, select
    font-family: inherit
    color: rgba(black, 0.8)
    min-width: 0
    width: 100%
    min-height: 24px
    line-height: 24px
    outline: none
    box-shadow: none
    -webkit-appearance: none
    border: none
    z-index: 2
    position: relative
    background: none
  textarea::placeholder, input::placeholder, select::placeholder
    color: rgba(black, 0.5)
  textarea
    padding: 0
  ._icon, ._prefix, ._suffix
    color: black
    opacity: 0.25
    transition: color 200ms ease, opacity 300ms ease
  &::after, &::before
    border-radius: 0.25rem
    position: absolute
    top: 0
    bottom: 0
    left: 0
    right: 0
    content: ''
    border-style: solid
    transition: border-color 300ms ease
  &::after
    border-width: 1px
    border-color: var(--c-border)
  &::before
    border-width: 2px
    border-color: transparent
  &:focus-within::after
    border-color: transparent
  &:focus-within::before
    border-color: var(--c-primary)
  &:focus-within ._icon,
  &:focus-within ._prefix,
  &:focus-within ._suffix
    color: var(--c-primary)
    opacity: 1
  ._prefix,
  ._suffix
    white-space: nowrap
  ._eye,
  ._cross
    +reset-button()
    z-index: 10
  ._eye
    color: var(--c-primary)
  ._cross
    color: white
    background: var(--c-primary)
    border-radius: 100px
    padding: 0
    transform: scale(0.8)
  &._kind-on-lilac
    border: none
    border-radius: 20px
    background: white
    padding-left: 1rem
    padding-right: 1rem
    &::after
      // border-color: #EDEBFF
      // border-color: var(--c-primary)
      border-color: rgba(0,0,0,0)
    &::before,
    &::after
      border-radius: 20px
    ._icon, ._prefix, ._suffix
      color: var(--c-primary)
      opacity: 1
    &:focus-within ._icon, ._prefix, ._suffix
      opacity: 1
    input
      color: black
  ._select-wrapper
    flex: 1
    display: flex
    align-items: center
    position: relative
  ._select-arrow
    position: absolute
    right: 0
  // type="date" edits
  &._type-date
    ._icon
      position: absolute
      right: 0.5rem
    input[type="date"]::-webkit-inner-spin-button,
    input[type="date"]::-webkit-calendar-picker-indicator
      opacity: 0
    input[type="date"]::-webkit-calendar-picker-indicator
      margin-inline-start: 1rem
    &._falsy
      input::-webkit-datetime-edit
        color: rgba(black, 0.5)
  &._type-date._has-icon-right
    ._icon
      right: 2rem
</style>
