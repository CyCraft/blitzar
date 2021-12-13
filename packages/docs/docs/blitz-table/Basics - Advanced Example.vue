<template>
  <div>
    <!-- :schemaGrid="schemaColumns" -->
    <BlitzTable
      :schemaColumns="schemaColumnsAndGrid"
      :schemaGrid="schemaColumnsAndGrid"
      :rows="rows"
      :titleField="{ component: 'h3', slot: 'Users' }"
      :searchField="{ component: 'input', placeholder: 'Search...' }"
      :gridToggleField="{ label: 'grid', component: 'input', type: 'checkbox' }"
      :pagesField="{
        label: 'Current page:',
        component: 'input',
        type: 'number',
      }"
      :rowsPerPageField="{
        label: 'Rows per page:',
        component: 'select',
        slot: [
          { component: 'option', slot: '5' },
          { component: 'option', slot: '10' },
          { component: 'option', slot: '20' },
          { component: 'option', slot: '50' },
          { component: 'option', slot: '100' },
        ],
      }"
      :shownRowsInfoField="{ component: 'div' }"
    />
  </div>
</template>

<style>
/* .blitz-table--title
.blitz-table--search
.blitz-table--grid-toggle
.blitz-table--table */
</style>

<script>
import { BlitzTableFieldShownRowsInfo } from '@blitzar/table'

const schemaColumnsAndGrid = [
  {
    id: 'avatarUrl',
    label: 'Avatar',
    component: 'img',
    mode: 'edit',
    src: (val) => val,
    dynamicProps: ['src'],
  },
  { id: 'firstName', label: 'First Name' },
  { id: 'lastName', label: 'Last Name' },
  { id: 'company', label: 'Company' },
  {
    id: 'birthdate',
    label: 'Birthdate',
    parseValue: (val) =>
      new Date(val).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
  },
  { id: 'balance', label: 'Balance', parseValue: (val) => val.toLocaleString() },
]

export default {
  data() {
    return {
      rows: [
        {
          _id: 'EA265B20-45F2-953C-C534-3E2A7862059C',
          isActive: false,
          onlineStatus: 'Do not disturb',
          balance: 93683,
          birthdate: '1946-07-22',
          favoriteColor: 'orange',
          firstName: 'Harper',
          lastName: 'Nolan',
          name: 'Harper Nolan',
          company: 'Tortor At Risus LLC',
          email: 'amet@posuerevulputate.co.uk',
          phone: '(0111) 194 7651',
          address: 'P.O. Box 298, 5571 Mauris Rd.',
          favoriteAnimal: 'owl',
          avatarUrl:
            'https://gravatar.com/avatar/8aa5e7a6220f2a87684a9f4e6286e343?s=100&d=robohash&r=x',
        },
        // other rows loaded asynchronously
      ],
      schemaColumnsAndGrid,
    }
  },
  mounted() {
    import('./users.json').then((_module) => {
      const users = _module.default
      this.rows = users
    })
  },
}
</script>
