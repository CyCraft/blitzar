// Mocks all files ending in `.vue` showing them as plain Vue instances
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
declare module '@blitzar/form'
declare module 'planetar'
declare module 'vue-scrollactive'
