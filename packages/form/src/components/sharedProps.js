// prop categories:
//   behavior
//   content
//   general
//   model
//   state
//   style

const propOf = `This prop can be set on an EasyField or on an EasyForm to make it global.`

// props both on EasyForm and EasyField
export const mode = {
  category: 'state',
  type: String,
  default: 'edit',
  validator: (prop) => ['edit', 'add', 'view', 'raw'].includes(prop),
  values: ['edit', 'add', 'view', 'raw'],
  examples: [`'edit'`, `'add'`, `'view'`, `'raw'`],
  desc: `The mode represents how fields are rendered
- "edit" or "add" means they can be interacted with
- "view" means they can't
- "raw" means the fields are not generated, just the raw value inside a div

${propOf}`,
}
export const labelPosition = {
  category: 'style',
  type: [String, Function],
  default: 'top',
  desc: `The position of the label in comparison to the field. ${propOf}`,
  values: ['top', 'left'],
  examples: ['top', 'left'],
}
export const evaluatedProps = {
  category: 'behavior',
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
  desc: `An array with prop names that should be treated as "Evaluated Props" when passed a function. ${propOf}`,
}
export const internalLabels = {
  category: 'style',
  type: [Boolean, undefined],
  required: false,
  default: undefined,
  desc: `Set to true if the component has its own labels and you do not want the EasyField to show a label.

When \`true\` subLabels will be passed as a prop called 'hint'.

${propOf}`,
}
export const internalErrors = {
  category: 'behavior|content',
  type: [Boolean, undefined],
  required: false,
  default: undefined,
  desc: `Set to true if the component has its own error handling. This makes sure it passes on props like \`rules\` and does nothing with them in the EasyField.

Will default to \`true\` for components with these names: QInput, QSelect, EfInput, EfSelect, EfInputDate.

${propOf}`,
}
