import { ExtractPropTypes, ExtractDefaultPropTypes, Ref, ComputedRef } from 'vue'
import { A, O } from 'ts-toolbelt'

export type ExternalProps<T extends Record<string | number | symbol, any>> = O.Optional<
  ExtractPropTypes<T>,
  keyof ExtractDefaultPropTypes<T>
>

export type AnyRef<T> = Ref<T> | ComputedRef<T>
