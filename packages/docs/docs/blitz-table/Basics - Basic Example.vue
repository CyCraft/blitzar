<template>
  <div>
    <!-- :schemaGrid="schemaColumns" -->
    <h3>Users</h3>
    
    <BlitzTable
      :schemaColumns="schemaColumns"
      :rows="rows"
    />
  </div>
</template>

<script>

const schemaColumns = [
  { id: 'firstName', label: 'First Name', component: 'input' },
  { id: 'lastName', label: 'Last Name', component: 'input' },
]

export default {
  data() {
    return {
      rows: [
        {
          "_id": "EA265B20-45F2-953C-C534-3E2A7862059C",
          "isActive": false,
          "onlineStatus": "Do not disturb",
          "balance": 93683,
          "birthdate": "1946-07-22",
          "favoriteColor": "orange",
          "firstName": "Harper",
          "lastName": "Nolan",
          "name": "Harper Nolan",
          "company": "Tortor At Risus LLC",
          "email": "amet@posuerevulputate.co.uk",
          "phone": "(0111) 194 7651",
          "address": "P.O. Box 298, 5571 Mauris Rd.",
          "favoriteAnimal": "owl"
        },
        // other rows loaded asynchronously
      ],
      schemaColumns
    }
  },
  mounted() {
    import('./users.json').then(_module => {
      const users = _module.default
      console.log(`users → `, users)
      this.rows = users
    })
  },
}
</script>
