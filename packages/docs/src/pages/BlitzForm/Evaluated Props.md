# Evaluated Props

As you know, `<BlitzForm />` needs a 'schema' with information on each field you want to show. However, when using a BlitzForm you can replace the value of any prop in any field with a function instead of the value directly. This function will be executed any time the data of any field changes. This allows you to have "dynamic" props, based on the data of the form.

For example, when you pass `disable: true` to a certain field, it will appear as disabled inside the form. You can instead also pass `disable: (val, context) => context.formData.myCheckBox` to be able to only disable that field when `myCheckBox` is truthy.

Evaluated props will receive 2 params: `(val, context)`.

- `val` is the current value of the field
- `context` is the Vue component reference of the `<BlitzField />`, you can deconstruct this to access any other properties/values.

The most important props you can access from `context`:

- `formData` This is the _nested_ data of all the fields inside a BlitzForm.
- `formDataFlat` This is the _flattened_ data of all the fields inside a BlitzForm.
- `mode` The current mode of the BlitzForm. Can be `'view'` | `'edit'` | `'add'` | `'raw'` | `'disabled'`
- `formId` An 'id' of the BlitzForm. This is only present when manually set.
- Other common Vue props like: `$store`, `$router`, `$q` (for Quasar apps) etc.

Try to refrain from accessing props other than the ones listed above, because these are mainly used internal and could have behaviour changes that could break your app.
