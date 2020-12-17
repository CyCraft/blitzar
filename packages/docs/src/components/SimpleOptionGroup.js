/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

export default {
  props: { id: String, value: [String, Array], type: String, options: Array },
  render(h) {
    const name = JSON.stringify(this.options)
    const emitInput = (o) => {
      if (this.type === 'radio') return this.$emit('input', o.value)
      const newValue = this.value.includes(o.value)
        ? this.value.filter((v) => v !== o.value)
        : [...this.value, o.value]
      this.$emit('input', newValue)
    }
    return h(
      'div',
      this.options.map((o) => [
        h('label', { on: { input: () => emitInput(o) } }, [
          h('input', { domProps: { type: this.type, value: o.value, name } }),
          [` ${o.label}`, h('div')],
        ]),
      ])
    )
  },
}
