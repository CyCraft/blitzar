import { ExtractPropTypes, ExtractDefaultPropTypes, Ref, ComputedRef } from 'vue'
import { SetOptional } from 'type-fest'

// eslint-disable-next-line @typescript-eslint/ban-types
export type ExternalProps<T extends Record<string | number | symbol, {}>> = SetOptional<
  ExtractPropTypes<T>,
  // @ts-ignore
  keyof ExtractDefaultPropTypes<T>
>

export type AnyRef<T> = Ref<T> | ComputedRef<T>
