<template>
  <div
    v-if="getEvaluatedPropOrAttr('showCondition')"
    :class="[
      'easy-field',
      `easy-field--${mode}`,
      `easy-field--${componentName}`,
      `easy-field--label-${labelPosition}`,
      {
        'easy-field--no-label': !labelUsedHere,
        'easy-field--no-sub-label': !subLabelHtmlUsedHere,
        'easy-field--no-component': !component,
      },
      ...fieldClassesArrayUsedHere,
    ]"
    :style="fieldStyleUsedHere"
  >
    <!-- display: inline -->
    <div v-if="labelUsedHere" class="easy-field__label">{{ labelUsedHere }}</div>
    <div v-if="subLabelHtmlUsedHere" class="easy-field__sub-label" v-html="subLabelHtmlUsedHere" />
    <!-- no component -->
    <template v-if="!component"></template>
    <!-- raw component -->
    <EfDiv
      v-else-if="mode === 'raw'"
      v-bind="EfDivProps"
      :class="['easy-field__component', ...componentClassesArrayUsedHere]"
      :style="componentStyleUsedHere"
    />
    <!-- raw component -->
    <component
      v-else-if="hasInternalOrNoErrors"
      :is="component"
      :class="['easy-field__component', ...componentClassesArrayUsedHere]"
      v-model="cValue"
      v-bind="propsAndAttrsToPass"
      v-on="eventsCalculated"
      :style="componentStyleUsedHere"
    />
    <QField
      v-else
      v-model="cValue"
      v-bind="propsAndAttrsToPassForQField"
      :class="['easy-field__component', ...componentClassesArrayUsedHere]"
      :style="componentStyleUsedHere"
    >
      <template v-slot:control>
        <component
          :is="component"
          v-model="cValue"
          v-bind="propsAndAttrsToPass"
          v-on="eventsCalculated"
          style="flex: 1"
        />
      </template>
    </QField>
  </div>
</template>

<style lang="sass">
// $
@import '../index.sass'

// layout
.easy-field
  max-width: 100%
  display: grid
  align-content: start
  grid-gap: $sm $md
  &--label-top
    grid-auto-flow: row
  &--label-left
    grid-auto-flow: column
    grid-template-columns: minmax(auto, max-content)
    grid-auto-columns: minmax(50%, 1fr)
    grid-template-rows: auto
    grid-auto-rows: 1fr
    .easy-field__sub-label
      grid-row: 2 / 3
    .easy-field__component
      grid-row: 1 / 3
    &.easy-field--no-sub-label
      .easy-field__label
        display: flex
        align-items: center
      .easy-field__component
        grid-row: 1 / 2
// style
.easy-field
  .easy-field__sub-label
    opacity: 0.8
    font-weight: 300
    .q-markdown--token
      white-space: pre-wrap
      word-break: break-word
</style>

<script>
import snarkdown from 'snarkdown'
import { QField } from 'quasar'
import {
  isFunction,
  isPlainObject,
  isString,
  isUndefined,
  isNullOrUndefined,
  isFullString,
} from 'is-what'
import { merge } from 'merge-anything'
import defaultLang from '../meta/lang'
import { createRequiredRule } from '../helpers/validation'
import {
  mode,
  labelPosition,
  evaluatedProps,
  internalLabels,
  internalErrors,
} from './sharedProps.js'

function evaluateProp(propValue, componentValue, componentInstance) {
  return isFunction(propValue) ? propValue(componentValue, componentInstance) : propValue
}

export default {
  name: 'EasyField',
  inheritAttrs: false,
  components: { QField },
  props: {
    // prop categories: behavior content general model state style
    // EF props used here:
    value: {
      category: 'model',
      type: undefined,
    },
    component: {
      category: 'general',
      type: [String, Object, Function],
      desc: `Each EasyField has a label, sublabel and a component rendered via \`<component :is="component" />\`. You can pass (1) the name of a registered component, or (2) a component’s options object.`,
      examples: ['QInput', 'MyCustomField'],
    },
    default: {
      category: 'model',
      type: undefined,
      desc: `A default value to be used when the 'value' is \`undefined\`.

You can also pass a function that will receive two params you can work with: \`(formData, context)\`
- \`formData\` is the value object of your EasyForm. This will be undefined when EasyField is used as stand-alone (without EasyForm) unless you manually pass it.
- \`context\` is either your EasyForm or EasyField context with many usefull props. See the documentation on "Evaluated Props" for more info.`,
    },
    required: {
      category: 'behavior',
      type: [Boolean, Function],
      desc: `Wether or not the field is required or not. If a field is marked 'required' it will add a default rule like so: \`[val => (val !== null && val !== undefined) || 'Field is required']\`. The default message can be set in the \`lang\` prop as \`requiredField\`.`,
    },
    rules: {
      category: 'behavior',
      type: [Array, Function],
      default: () => [],
    },
    id: {
      category: 'model',
      type: String,
      desc:
        "An 'id' is required for an `<EasyForm />` to be able to know which fields have which value. When using `<EasyField />` on its own, it is not required.",
    },
    subLabel: {
      category: 'content',
      type: [String, Function],
      desc: 'A smaller label for extra info.',
    },
    fieldStyle: {
      category: 'style',
      type: [Object, Array, String, Function],
      desc:
        'Custom styling to be applied to the EasyField. Applied like so `:style="fieldStyle"`. Can be an Evaluated Prop (this is why I opted to have a different name from `style`).',
      examples: [`'padding: 1em;'`],
    },
    fieldClasses: {
      category: 'style',
      type: [Object, Array, String, Function],
      desc:
        'Custom classes to be applied to the EasyField. Applied like so `:class="fieldClasses"`. Can be an Evaluated Prop (this is why I opted to have a different name from `class`).',
      examples: [`['dark-theme']`],
    },
    componentStyle: {
      category: 'style',
      type: [Object, Array, String, Function],
      desc:
        'Custom styling to be applied to the inner component of EasyField. Applied like so `:style="componentStyle"`. Can be an Evaluated Prop.',
      examples: [`'padding: 1em;'`],
    },
    componentClasses: {
      category: 'style',
      type: [Object, Array, String, Function],
      desc:
        'Custom classes to be applied to the inner component of EasyField. Applied like so `:class="componentClasses"`. Can be an Evaluated Prop.',
      examples: [`['dark-theme']`],
    },
    parseValue: {
      category: 'model',
      type: Function,
      desc:
        'This function can modify a value before it is passed on to the inner component. Also see `parseInput` for the reverse.',
      examples: ['val => Number(val)', 'val => Date(val)'],
    },
    parseInput: {
      category: 'model',
      type: Function,
      desc:
        'This function can modify a value upon user input, every time before the value is emitted. Also see `parseValue` for the reverse.',
      examples: ['val => String(val)', 'val => val.toISOString()'],
    },
    events: {
      category: 'behavior',
      type: Object,
      desc:
        'An Object with an event name as key and the handler function as value. The function you pass will receive the native event payload as first parameter and the EasyField context (the component instance) as second: `($event, context) => {}`',
      default: () => ({}),
      examples: ["{click: (val, {$router}) => $router.push('/')}", '{focus: console.log}'],
    },
    lang: {
      category: 'content',
      type: Object,
      desc: `The text used in the UI, eg. for required fields, etc.`,
      default: () => defaultLang,
      examples: [`{requiredField: 'Don\'t forget this field!'}`],
    },
    // shared props:
    mode,
    labelPosition,
    evaluatedProps,
    internalLabels,
    internalErrors,
    // passed props:
    formData: {
      category: 'easyFormProp',
      type: Object,
      desc: `This is the *nested* data of all the fields inside an EasyForm.`,
    },
    formDataFlat: {
      category: 'easyFormProp',
      type: Object,
      desc: `This is the *flattened* data of all the fields inside an EasyForm.`,
    },
    formId: {
      category: 'easyFormProp',
      type: String,
      desc: `A manually set 'id' of the EasyForm.`,
    },
    fieldInput: {
      category: 'easyFormProp',
      type: Function,
      desc:
        "The `fieldInput` function of EasyForm. Is passed so it can be used in the input event: `events: {input: (value, {fieldInput} => fieldInput({id: 'otherField', value}))}`",
    },
    showCondition: {
      category: 'behavior|state',
      type: [Function, Boolean],
      desc:
        'Setting to `true` or `false` can show or hide the field. When using as an Evaluated Prop it can be very powerful.',
      examples: [`false`, `(val, {mode}) => mode.edit`],
      default: true,
    },
    // Quasar props with modified defaults:
    // (category needs to be specified in case sub-field doesn't inherit this prop from Quasar)
    readonly: {
      category: 'state',
      inheritedProp: 'modified',
      type: [Boolean, Function],
      default: false,
      desc: "`readonly` defaults to `true` on `mode: 'view'",
    },
    // Quasar props with modified behavior:
    // (category needs to be specified in case sub-field doesn't inherit this prop from Quasar)
    label: {
      category: 'content',
      inheritedProp: 'modified',
      type: [String, Function],
      desc:
        'An EasyField label is always "external" to the field. (It replaces the Quasar label if the underlying Quasar component uses one.)',
    },
  },
  data() {
    const { value, default: df, formData, internalErrors } = this
    if (!isUndefined(value)) return { innerValue: value }
    const innerValue = isFunction(df) ? df(formData, this) : df
    this.$emit('input', innerValue, 'default')
    return {
      innerValue,
    }
  },
  watch: {
    value(newValue) {
      this.innerValue = newValue
    },
  },
  methods: {
    getEvaluatedPropOrAttr(propOrAttr) {
      const { evaluatedPropsDataObject } = this
      if (propOrAttr in evaluatedPropsDataObject) return evaluatedPropsDataObject[propOrAttr]
      if (propOrAttr in this) return this[propOrAttr]
      return this.$attrs[propOrAttr]
    },
  },
  computed: {
    cValue: {
      get() {
        const { parseValue, innerValue } = this
        if (isFunction(parseValue)) return parseValue(innerValue, this)
        return innerValue
      },
      set(val, ...otherArguments) {
        const { parseInput, events } = this
        if (isFunction(parseInput)) val = parseInput(val, this)
        if (isFunction(events.input)) events.input(val, this)
        this.$emit('input', val, ...otherArguments)
      },
    },
    evaluatedPropsDataObject() {
      const { evaluatedProps, cValue } = this
      const context = this
      return evaluatedProps.reduce((carry, propKey) => {
        const propValue = propKey in context ? context[propKey] : context.$attrs[propKey]
        carry[propKey] = evaluateProp(propValue, cValue, context)
        return carry
      }, {})
    },
    componentName() {
      const { getEvaluatedPropOrAttr } = this
      const component = getEvaluatedPropOrAttr('component')
      if (isString(component)) return component
      const { name } = component || {}
      return name
    },
    hasInternalOrNoErrors() {
      const { getEvaluatedPropOrAttr, componentName, rulesCalculated } = this
      const internalErrors = getEvaluatedPropOrAttr('internalErrors')
      if (internalErrors !== undefined) return internalErrors
      return (
        !rulesCalculated.length ||
        [
          'QInput',
          'QSelect',
          'QField',
          'EfInput',
          'EfSelect',
          'EfInputDate',
          'q-input',
          'q-select',
          'q-field',
        ].includes(componentName)
      )
    },
    internalLabelsCalculated() {
      const { component, getEvaluatedPropOrAttr } = this
      const internalLabels = getEvaluatedPropOrAttr('internalLabels')
      return internalLabels && !isNullOrUndefined(component)
    },
    langCalculated() {
      const { getEvaluatedPropOrAttr } = this
      const lang = getEvaluatedPropOrAttr('lang')
      return merge(defaultLang, lang)
    },
    rulesCalculated() {
      const { getEvaluatedPropOrAttr, langCalculated } = this
      const required = getEvaluatedPropOrAttr('required')
      const rules = getEvaluatedPropOrAttr('rules')
      const requiredRule = createRequiredRule(langCalculated['requiredField'])
      return required ? [requiredRule, ...rules] : rules
    },
    eventsCalculated() {
      const { getEvaluatedPropOrAttr } = this
      const context = this
      const events = getEvaluatedPropOrAttr('events')
      return Object.entries(events).reduce((carry, [eventName, eventFn]) => {
        // input event is handled in cValue
        if (eventName === 'input') return carry
        carry[eventName] = (val, ...otherArguments) => eventFn(val, context, ...otherArguments)
        return carry
      }, {})
    },
    propsAndAttrsToPass() {
      // props only used here: parseValue, parseInput, label
      const {
        $attrs,
        getEvaluatedPropOrAttr,
        langCalculated,
        rulesCalculated,
        internalLabelsCalculated,
      } = this
      // should we pass on label & subLabel (as hint) or not
      const labelToPass = !internalLabelsCalculated ? undefined : getEvaluatedPropOrAttr('label')
      const hintToPass = !internalLabelsCalculated
        ? getEvaluatedPropOrAttr('hint')
        : getEvaluatedPropOrAttr('subLabel')
      const readonlyToPass =
        getEvaluatedPropOrAttr('mode') === 'view' || getEvaluatedPropOrAttr('readonly')
      const propsToPass = {
        lang: langCalculated,
        rules: rulesCalculated,
        label: labelToPass,
        hint: hintToPass,
        readonly: readonlyToPass,
      }
      const attrsToPass = Object.keys($attrs).reduce((carry, attrKey) => {
        carry[attrKey] = getEvaluatedPropOrAttr(attrKey)
        return carry
      }, {})
      return { ...propsToPass, ...attrsToPass }
    },
    propsAndAttrsToPassForQField() {
      // disable prefix suffix for QField
      return merge(this.propsAndAttrsToPass, {
        prefix: undefined,
        suffix: undefined,
        borderless: true,
        stackLabel: true,
      })
    },
    labelUsedHere() {
      const { internalLabelsCalculated, getEvaluatedPropOrAttr } = this
      return internalLabelsCalculated ? undefined : getEvaluatedPropOrAttr('label')
    },
    subLabelHtmlUsedHere() {
      const { internalLabelsCalculated, getEvaluatedPropOrAttr } = this
      const subLabel = internalLabelsCalculated ? undefined : getEvaluatedPropOrAttr('subLabel')
      if (!isFullString(subLabel)) return null
      return snarkdown(subLabel)
    },
    fieldStyleUsedHere() {
      return this.getEvaluatedPropOrAttr('fieldStyle')
    },
    componentStyleUsedHere() {
      return this.getEvaluatedPropOrAttr('componentStyle')
    },
    fieldClassesArrayUsedHere() {
      const classes = this.getEvaluatedPropOrAttr('fieldClasses')
      if (isString(classes)) return classes.split(' ')
      if (isPlainObject(classes)) return [classes]
      return classes
    },
    componentClassesArrayUsedHere() {
      const classes = this.getEvaluatedPropOrAttr('componentClasses')
      if (isString(classes)) return classes.split(' ')
      if (isPlainObject(classes)) return [classes]
      return classes
    },
    EfDivProps() {
      const { cValue, getEvaluatedPropOrAttr } = this
      return {
        value: cValue,
        valueType: getEvaluatedPropOrAttr('valueType'),
        type: getEvaluatedPropOrAttr('type'),
        dateFormat: getEvaluatedPropOrAttr('dateFormat'),
        suffix: getEvaluatedPropOrAttr('suffix'),
        prefix: getEvaluatedPropOrAttr('prefix'),
        options: getEvaluatedPropOrAttr('options'),
        multiple: getEvaluatedPropOrAttr('multiple'),
      }
    },
  },
}
</script>
