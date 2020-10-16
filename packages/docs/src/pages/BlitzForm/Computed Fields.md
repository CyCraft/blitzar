# Computed Fields

Computed fields are fields that can represent data which doesn't neccesarily exist in your data. They have a "caluculated value" based on the form data.

Do not confuse this concept with "Evaluated Props".

- Evaluated Props: a calculated prop of a field
- Computed Fields: a field with a calculated value

An example of a Computed Field could be a full name of a person which exists of `${formData.firstName} ${formData.lastName}`

There are three ways we could create such a field:
