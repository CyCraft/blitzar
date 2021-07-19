# Computed Fields

Computed Fields are when you need to add a field in your form that have a _**calculated value**_ based on the form data or some other fields.

Do not confuse this concept with <span style="opacity: 0.5">#</span>[Evaluated Props](#evaluated-props).

- Evaluated Props: a calculated _**prop of**_ a field
- Computed Fields: a field with a calculated _**value**_

An example of a Computed Field could be a full name of a person which exists of `${formData.firstName} ${formData.lastName}`

There are three ways we could create such a field:
