/**
 * The mode represents how fields are rendered
 * - "edit" or "add" means they can be interacted with
 * - "view" means they can't
 * - "raw" means the fields are not generated, just the raw value inside a div
 *
 * This prop can be set on an EasyField or on an EasyForm (in which case it's applied to all fields).
 * @type {'edit' | 'add' | 'view' | 'raw'}
 * @category state
 */
export const mode = {
  type: String,
  default: 'edit',
  validator: (prop) => ['edit', 'add', 'view', 'raw'].includes(prop),
}
/**
 * The position of the label in comparison to the field.
 *
 * This prop can be set on an EasyField or on an EasyForm (in which case it's applied to all fields).
 * @type {'top' | 'left'}
 * @category style
 */
export const labelPosition = {
  type: [String, Function],
  default: 'top',
  validator: (prop) => ['top', 'left'].includes(prop),
}
/**
 * An array with prop names that should be treated as "Evaluated Props" when passed a function.
 *
 * This prop can be set on an EasyField or on an EasyForm (in which case it's applied to all fields).
 * @category behavior
 */
export const evaluatedProps = {
  type: Array,
  default: () => [
    'component',
    'showCondition',
    'label',
    'subLabel',
    'required',
    'rules',
    'fieldStyle',
    'fieldClasses',
    'componentStyle',
    'componentClasses',
    'disable',
    'events',
    'lang',
  ],
}
/**
 * Set to true if the component has its own labels and you do not want the EasyField to show a label.
 *
 * When `true` subLabels will be passed as a prop called 'hint'.
 *
 * This prop can be set on an EasyField or on an EasyForm (in which case it's applied to all fields).
 * @category style
 */
export const internalLabels = {
  type: [Boolean, undefined],
  required: false,
  default: undefined,
}
/**
 * Set to true if the component has its own error handling. This makes sure it passes on props like `rules` and does nothing with them in the EasyField.
 *
 * Will default to `true` for components with these names: QInput, QSelect, EfInput, EfSelect, EfInputDate.
 *
 * This prop can be set on an EasyField or on an EasyForm (in which case it's applied to all fields).
 * @category behavior
 * @category content
 */
export const internalErrors = {
  type: [Boolean, undefined],
  required: false,
  default: undefined,
}
