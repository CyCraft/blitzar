<template>
  <div>
    <BlitzTable
      :schemaColumns="schemaColumns"
      :schemaGrid="schemaColumns"
      :rows="rows"
      title="My Lessons"
      flat
      bordered
    />
  </div>
</template>

<style lang="sass" scoped></style>

<script>
import { BlitzTable } from 'blitzar'

const rows = [
  {
    title: 'Mathematica',
    topic: 'curriculum',
    subject: 'We will look at the curriculum of the Mathematica √/%^×-+÷',
    img: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=50',
    grade: 90000,
    passing: true,
    created: '2020-12-06',
  },
  {
    title: 'Films',
    topic: 'split',
    subject: 'We will look at the split of the Films √/%^×-+÷',
    img: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=50',
    grade: 80000,
    passing: false,
    created: '2020-01-01',
  },
  {
    title: 'Winds',
    topic: 'north',
    subject: 'We will look at the north of the Winds √/%^×-+÷',
    img: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=50',
    grade: 120000,
    passing: false,
    created: '2020-12-06',
  },
  {
    title: 'Apps',
    topic: 'hotdog',
    subject: 'We will look at the hotdog of the Apps √/%^×-+÷',
    img: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=50',
    grade: 25,
    passing: true,
    created: '1990-01-01',
  },
  {
    title: 'Computers',
    topic: 'hardware',
    subject: 'We will look at the hardware of the Computers √/%^×-+÷',
    img: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=50',
    grade: 0,
    passing: false,
    created: '2020-12-06',
  },
]

const schemaColumns = [
  {
    id: 'title',
    label: 'Lesson Title',
    component: 'input',
  },
  {
    id: 'topic',
    label: 'Topic',
    component: 'input',
  },
  {
    id: 'subject',
    label: 'Subject',
    component: 'input',
  },
  {
    id: 'img',
    label: 'Image',
    component: 'img',
    dynamicProps: ['src'],
    src: (val) => val,
    mode: 'view',
  },
  {
    id: 'grade',
    label: 'Grade',
    component: 'input',
    type: 'number',
  },
  {
    id: 'passing',
    label: 'Passing',
    component: 'input',
    type: 'checkbox',
    defaultValue: false,
  },
  {
    id: 'created',
    label: 'Created at',
    component: 'input',
    type: 'date',
  },
]

export default {
  components: { BlitzTable },
  data() {
    return { rows, schemaColumns }
  },
}
</script>
