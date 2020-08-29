<template>
  <q-dialog ref="dialog" @hide="onDialogHide()" v-bind="dialogProps">
    <div class="dialog-wrapper">
      <component :is="slotComponent" v-bind="innerSlotProps" v-on="innerSlotEvents" />
      <q-btn
        v-if="showCloseButton"
        @click="hide"
        class="_close"
        icon="close"
        color="primary"
        size="lg"
        flat
      />
    </div>
  </q-dialog>
</template>

<style lang="sass" scoped>
// $

.dialog-wrapper
  position: relative
  background: white
  min-width: 50vw
  ._close
    position: absolute
    top: 0
    right: 0
</style>

<script>
import { isFunction } from 'is-what'

export default {
  name: 'DWrapper',
  props: {
    /**
     * Display a generic `✗` close button on the top-right.
     */
    showCloseButton: { type: Boolean, default: false },
    /**
     * The props that will be bound to the dialog component (with `v-bind="dialogProps"`)
     */
    dialogProps: { type: Object },
    /**
     * The component to show in the dialog. Can be a direct Vue component instance or a string with the component name (if registered).
     */
    slotComponent: { type: undefined },
    /**
     * The props that will be bound to the slot component (with `v-bind="slotProps"`). When passed a function it will receive the DialogWrapper context `(this)` as param and must return an object (with `this` you can use the context to do `hide()` etc.)
     */
    slotProps: { type: [Object, Function] },
    /**
     * The events that will be listened to, on the slot component (with `v-on="slotEvents"`). When passed a function it will receive the DialogWrapper context `(this)` as param and must return an object (with `this` you can use the context to do `hide()` etc.)
     */
    slotEvents: { type: [Object, Function] },
  },
  data() {
    const { slotProps, slotEvents } = this
    const innerSlotProps = isFunction(slotProps) ? slotProps(this) : slotProps
    const innerSlotEvents = isFunction(slotEvents) ? slotEvents(this) : slotEvents
    return {
      innerSlotProps,
      innerSlotEvents,
    }
  },
  computed: {},
  methods: {
    // following method is REQUIRED
    // (don't change its name --> "show")
    show() {
      if (!this.$refs.dialog) return
      this.$refs.dialog.show()
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide() {
      if (!this.$refs.dialog) return
      this.$refs.dialog.hide()
    },

    onDialogHide(val) {
      if (val !== undefined) {
        return this.Ok(val)
      }
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide')
    },

    Ok(val) {
      // on Ok, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit('ok', val)
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide()
    },

    onCancelClick() {
      // we just need to hide dialog
      this.hide()
    },
  },
}
</script>
