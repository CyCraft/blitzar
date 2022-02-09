import { computed, ref, WritableComputedRef } from 'vue'

export function propToWriteableComputed<T>(
  prop: T,
  setCallback: (newVal: T) => void
): WritableComputedRef<T> {
  const inner = ref<any>(prop)
  return computed({
    get(): any {
      return inner.value
    },
    set(newVal: any) {
      inner.value = newVal
      setCallback(newVal)
    },
  })
}
