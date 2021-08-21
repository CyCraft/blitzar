<template>
  <div :class="`base-input ${disabled ? '_disabled' : ''}`" @click.stop="focus">
    <div v-if="prefix" class="_prefix">{{ prefix }}</div>
    <Pepicon v-if="icon" class="_icon" size="20px" type="pop" :name="icon" />
    <input
      v-if="type !== 'textarea'"
      :disabled="disabled"
      :type="fieldType"
      :placeholder="placeholder"
      :readonly="readonly"
      :required="required"
      :autofocus="autofocus"
      :debounce="debounce"
      v-model="valueInner"
      data-cy="input-field"
      ref="input"
      v-bind="$attrs"
      @blur="(e) => $emit('blur', e)"
      @focus="(e) => $emit('focus', e)"
      @keydown.13="(e) => $emit('enter', e)"
    />
    <textarea
      v-if="type === 'textarea'"
      :style="`${rows === '1' ? 'resize: none' : ''}; height: ${textareaHeight}`"
      :rows="rows"
      :disabled="disabled"
      :placeholder="placeholder"
      :readonly="readonly"
      :required="required"
      :autofocus="autofocus"
      :debounce="debounce"
      data-cy="input-field"
      ref="textarea"
      v-model="valueInner"
      v-bind="$attrs"
      @blur="(e) => $emit('blur', e)"
      @focus="(e) => $emit('focus', e)"
      @keydown.13="(e) => $emit('enter', e)"
    />
    <slot />
    <div v-if="suffix" class="_suffix ml-xs">{{ suffix }}</div>
    <div class="_right-side" v-if="showCheck && !showError">
      <Pepicon class="_icon-synced" size="18px" type="pop" name="checkmark" />
    </div>
    <div class="_right-side" v-if="showError">
      <Pepicon class="_icon-error" size="18px" type="pop" name="times" />
    </div>
    <button type="button" @click="toggleVisiblity" class="_right-side" v-if="type === 'password'">
      <Pepicon type="pop" :name="eyeSvg" class="_icon-eye" />
    </button>
    <button
      type="button"
      @click="clearInput"
      class="_right-side"
      v-if="(clearable || icon === 'loop') && valueInner"
    >
      <Pepicon type="pop" name="times" class="_icon-clear" />
    </button>
  </div>
</template>

<style>
.base-input {
  --c-primary: #0b3d92;
}

/** Global Styles */
.base-input {
  min-width: 0;
  max-width: 100%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  position: relative;
  padding: 0.5rem;
}
._disabled {
  opacity: 0.7 !important;
  cursor: not-allowed !important;
}
.base-input textarea,
.base-input input {
  min-width: 0;
  width: 100%;
  min-height: 24px;
  line-height: 24px;
  outline: none;
  box-shadow: none;
  -webkit-appearance: none;
  border: none;
  z-index: 2;
  position: relative;
  background: none;
}
.base-input textarea {
  padding: 0;
}
._prefix,
._icon {
  margin-right: 0.25rem;
}
._icon,
._prefix,
._suffix {
  color: black;
  opacity: 0.25;
  transition: color 200ms ease, opacity 300ms ease;
}
.base-input::after,
.base-input::before {
  border-radius: 0.25rem;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  content: '';
  border-style: solid;
  transition: border-color 300ms ease;
}
.base-input::after {
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.24);
}
.base-input::before {
  border-width: 2px;
  border-color: transparent;
}
.base-input:focus-within::after {
  border-color: transparent;
}
.base-input:focus-within::before {
  border-color: var(--c-primary);
}
.base-input:focus-within ._icon,
.base-input:focus-within ._prefix,
.base-input:focus-within ._suffix {
  color: var(--c-primary);
  opacity: 1;
}
._prefix,
._suffix {
  white-space: nowrap;
}
._right-side {
  padding: 0;
  background: none;
  border: none;
  z-index: 10;
  margin-left: auto;
  padding-left: 0.5rem;
}
._right-side:focus {
  outline: none;
}
._icon-synced,
._icon-error,
._icon-clear {
  color: white;
  border-radius: 100%;
  padding: 2px;
}
._icon-clear {
  padding: 0;
  transform: scale(0.8);
}
._icon-synced,
._icon-clear {
  background: var(--c-primary);
}
._icon-error {
  background: #ff2038;
}
._icon-eye {
  color: var(--c-primary);
}
</style>

<script>
import { Pepicon } from 'vue-pepicons'
import { isFullString, isNumber } from 'is-what'

export default {
  name: 'BaseInput',
  components: { Pepicon },
  props: {
    /**
     * Pepicon icon name
     */
    icon: { type: String, default: '' },
    /**
     */
    suffix: { type: String, default: '' },
    /**
     */
    prefix: { type: String, default: '' },
    /**
     * Shows an '✅' icon on the right side of the input field.
     */
    showCheck: { type: Boolean, default: false },
    /**
     * Shows an '❌' icon on the right side of the input field.
     */
    showError: { type: Boolean, default: false },
    /**
     * HTML5 attribute (can also be 'textarea' in which case a `<textarea />` is rendered)
     */
    type: { type: String, default: 'text' },
    /**
     * HTML5 attribute
     */
    placeholder: { type: String },
    /**
     * HTML5 attribute
     */
    disabled: { type: Boolean },
    /**
     * HTML5 attribute
     */
    readonly: { type: Boolean },
    /**
     * HTML5 attribute
     */
    required: { type: Boolean },
    /**
     * HTML5 attribute (only for type="textarea")
     */
    rows: { type: String, default: '3' },
    /**
     * v-model
     */
    modelValue: { type: [String, Number], default: '' },
    /**
     */
    autofocus: { type: Boolean, default: false },
    /**
     */
    autogrow: { type: Boolean, default: false },
    /**
     */
    debounce: { type: Number, default: 0 },
    /**
     */
    clearable: { type: Boolean, default: false },
  },
  mounted() {
    if (this.valueInner) {
      // only autogrow on mount when there's input
      // otherwise it will not adhere to eg. `rows="3"` on empty textareas
      this.autogrowInput()
    }
    if (this.autofocus) {
      this.focus()
    }
  },
  watch: {
    type(newVal) {
      this.fieldType = newVal
    },
    modelValue(newVal) {
      if (newVal !== this.valueInner) {
        this.valueInner = newVal
      }
    },
    valueInner(newVal) {
      this.autogrowInput()
      const debounceMs = this.debounce
      if (debounceMs > 0) {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => this.emitInput(newVal), debounceMs)
      } else {
        this.emitInput(newVal)
      }
    },
  },
  data() {
    return {
      textareaHeight: 'unset',
      timeout: null,
      valueInner: this.modelValue,
      fieldType: this.type,
      eyeSvg: 'eye-closed',
    }
  },
  methods: {
    emitInput(newVal) {
      let payload = newVal
      if (isFullString(newVal) && this.type === 'number') {
        if (isNumber(Number(newVal))) {
          payload = Number(newVal)
        }
      }
      this.$emit('update:modelValue', payload)
    },
    focus() {
      if (this.type === 'textarea') {
        const ref = this.$refs.textarea
        if (!!ref) ref.focus()
        return
      }
      const ref = this.$refs.input
      if (!!ref) ref.focus()
    },
    autogrowInput() {
      const textAreaRef = this.$refs.textarea
      if (!!textAreaRef && this.type === 'textarea' && this.autogrow) {
        this.textareaHeight = 'auto'
        this.textareaHeight = `${textAreaRef.scrollHeight}px`
        setTimeout(() => {
          this.textareaHeight = `${textAreaRef.scrollHeight}px`
        }, 1)
      }
    },
    toggleVisiblity() {
      this.eyeSvg = this.eyeSvg === 'eye-closed' ? 'eye' : 'eye-closed'
      this.fieldType = this.fieldType === 'text' ? 'password' : 'text'
    },
    clearInput() {
      this.valueInner = ''
    },
  },
}
</script>
