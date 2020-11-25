# Basics

In some cases you might need a form that's actually a _**list**_ users can fill in. Eg. Have a form where a teacher can write down names of students in a list.

For this I prepared a special kind of form called a `<BlitzListForm />` that offers these features:

- Auto populates the next empty row whenever there is user input
- Rows can have multiple input fields defined by the same schema syntax as BlitzForm
- Can be used as standalone component or inside a BlitzForm between other fields
- Saves the data as an array
