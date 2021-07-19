# Evaluated Props

As you know, BlitzForm needs a `schema` with information on each field you want to show. Each field in your schema can have props like `label` `component` and any prop the component itself might need.

However, your fields can also have _**dynamic props**_, for example based on the data of the form! Such dynamic props are called Evaluated Props.

To use this you need to set the prop to a function. This function will be executed any time the data of any field changes.

Your form could have a disabled field by setting `disabled: true` to that field. But you can make a field be disabled based on wether or not a checkbox in your form is checked. In this case set the `disabled` prop to `(val, context) => !!context.formData.myCheckBox`. Now that field is disabled when `myCheckBox` is true.

The function you use for Evaluated Props receive 2 params `(val, context)`.

- `val` — this is the current value of the field
- `context` — this is the Vue component reference of the BlitzField, you can use this to access any other properties/values

The most important props you can access on `context`:

- `formData` — this is the _**nested**_ data of all the fields inside a BlitzForm
- `formDataFlat` — this is the **_flattened_** data of all the fields inside a BlitzForm
- `mode` — the current mode of the BlitzForm. Can be `'view'` | `'edit'` | `'add'` | `'raw'` | `'disabled'`

Try to refrain from accessing props other than the ones listed above, because these are mainly used internal and could have behaviour changes that could break your app.
