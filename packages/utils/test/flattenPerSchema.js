import test from 'ava'
import { flattenPerSchema } from '../src/'

test('flattenPerSchema', (t) => {
  let res, target, schema
  target = {
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
  schema = {
    payAsYouGoPrice: {
      id: 'payAsYouGoPrice',
      label: '使用料別電気単価',
      valueType: 'array',
      schema: [
        {
          id: 'to',
          label: '電気量範囲',
          valueType: 'number',
          prefix: 'kWh以上～',
          suffix: 'kWh未満',
        },
        {
          id: 'price',
          label: '電気単価',
          valueType: 'number',
          suffix: '円/kWh',
        },
      ],
      showCondition: [['planType', '===', 'payAsYouGo']],
    },
    'timeFee.d': {
      id: 'timeFee.d',
      label: '昼間の電気単価',
      valueType: 'number',
      suffix: '円/kW',
      showCondition: [['planType', '===', 'allElecPlan']],
    },
    'timeFeeBreakdown.d': {
      id: 'timeFeeBreakdown.d',
      label: '昼間の適用時間帯',
      valueType: 'object',
      showCondition: [['planType', '===', 'allElecPlan']],
      min: 0,
      max: 24,
    },
    'timeFee.n': {
      id: 'timeFee.n',
      label: '夜間の電気単価',
      valueType: 'number',
      suffix: '円/kW',
      showCondition: [['planType', '===', 'allElecPlan']],
    },
    'timeFeeBreakdown.n': {
      id: 'timeFeeBreakdown.n',
      label: '夜間の適用時間帯',
      valueType: 'object',
      showCondition: [['planType', '===', 'allElecPlan']],
      min: -12,
      max: 12,
    },
    hasMorningFee: {
      id: 'hasMorningFee',
      label: '朝夕間の電気料金の有無',
      valueType: 'boolean',
      showCondition: [['planType', '===', 'allElecPlan']],
    },
    'timeFeeBreakdown.m': {
      id: 'timeFeeBreakdown.m',
      label: '朝の適用時間帯',
      valueType: 'object',
      showCondition: [
        ['planType', '===', 'allElecPlan'],
        ['hasMorningFee', '===', true],
      ],
      min: 0,
      max: 24,
    },
    'timeFee.m': {
      id: 'timeFee.m',
      label: '朝夕間の電気単価',
      valueType: 'number',
      suffix: '円/kW',
      showCondition: [
        ['planType', '===', 'allElecPlan'],
        ['hasMorningFee', '===', true],
      ],
    },
    'timeFeeBreakdown.e': {
      id: 'timeFeeBreakdown.e',
      label: '夕方の適用時間帯',
      valueType: 'object',
      showCondition: [
        ['planType', '===', 'allElecPlan'],
        ['hasMorningFee', '===', true],
      ],
      min: 0,
      max: 24,
    },
  }
  res = flattenPerSchema(target, schema)
  t.deepEqual(res, {
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
