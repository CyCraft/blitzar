import { SchemaField } from '@blitzar/types'
import { test, expect } from 'vitest'
import { flattenPerSchema } from '../src/flattenPerSchema'

test('flattenPerSchema', () => {
  const target = {
    payAsYouGoPrice: [],
    price: 0,
    timeFee: { d: 23, m: 0, n: 12.97 },
    timeFeeBreakdown: {
      d: { from: 8, to: 22 },
      e: { from: 21, to: 21 },
      m: { from: 9, to: 9 },
      n: { from: -2, to: 8 },
    },
  }
  const schema: SchemaField[] = [
    {
      id: 'payAsYouGoPrice',
      label: '使用料別電気単価',
      schema: [
        {
          id: 'to',
          label: '電気量範囲',
          prefix: 'kWh以上～',
          suffix: 'kWh未満',
        },
        {
          id: 'price',
          label: '電気単価',
          suffix: '円/kWh',
        },
      ],
    },
    {
      id: 'timeFee.d',
      label: '昼間の電気単価',
      suffix: '円/kW',
    },
    {
      id: 'timeFeeBreakdown.d',
      label: '昼間の適用時間帯',
      min: 0,
      max: 24,
    },
    {
      id: 'timeFee.n',
      label: '夜間の電気単価',
      suffix: '円/kW',
    },
    {
      id: 'timeFeeBreakdown.n',
      label: '夜間の適用時間帯',
      min: -12,
      max: 12,
    },
    {
      id: 'hasMorningFee',
      label: '朝夕間の電気料金の有無',
    },
    {
      id: 'timeFeeBreakdown.m',
      label: '朝の適用時間帯',
      min: 0,
      max: 24,
    },
    {
      id: 'timeFee.m',
      label: '朝夕間の電気単価',
      suffix: '円/kW',
    },
    {
      id: 'timeFeeBreakdown.e',
      label: '夕方の適用時間帯',
      min: 0,
      max: 24,
    },
  ]
  const res = flattenPerSchema(target, schema)
  expect(res).toEqual({
    payAsYouGoPrice: [],
    price: 0,
    timeFee: {},
    'timeFee.d': 23,
    'timeFee.m': 0,
    'timeFee.n': 12.97,
    timeFeeBreakdown: {},
    'timeFeeBreakdown.d': { from: 8, to: 22 },
    'timeFeeBreakdown.e': { from: 21, to: 21 },
    'timeFeeBreakdown.m': { from: 9, to: 9 },
    'timeFeeBreakdown.n': { from: -2, to: 8 },
  })
})
