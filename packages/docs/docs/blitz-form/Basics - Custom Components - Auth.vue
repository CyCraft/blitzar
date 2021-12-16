<template>
  <div>
    <form>
      <BlitzForm :schema="schema" v-model="formData" :columnCount="2" />
    </form>

    <CodeBlock :content="`// formData\n${JSON.stringify(formData, undefined, 2)}`" />
  </div>
</template>

<script>
const schema = [
  {
    id: 'username',
    component: 'BaseInput',
    label: 'Email',
    // component props:
    placeholder: 'you@email.com',
    autocomplete: 'username',
  },
  {
    id: 'password',
    component: 'BaseInput',
    label: 'Password',
    // component props:
    type: 'password',
    autocomplete: 'new-password',
  },
]

export default {
  data() {
    return { schema, formData: {} }
  },
}
</script>
