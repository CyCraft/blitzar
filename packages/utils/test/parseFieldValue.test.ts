import { test, expect } from 'vitest'
import { flattenObject } from 'flatten-anything'
import { nestifyObject } from 'nestify-anything'
import { parseFieldValue } from '../src'

test('parse field value — number', () => {
  const res = parseFieldValue(2, {})
  expect(res).toEqual('2')
})
test('parse field value — date', () => {
  const d = new Date()
  const res = parseFieldValue(d, {})
  expect(res).toEqual(d.toLocaleDateString())
})

const parseObject = (target: any, schema: any): any => {
  const flat = flattenObject(target)
  const parsed = Object.entries(flat).reduce<any>((carry, [key, value]) => {
    const blueprint = schema.find((bp: any) => bp.id === key) || {}
    carry[key] = parseFieldValue(value, blueprint)
    return carry
  }, {})
  return nestifyObject(parsed)
}

test('options', () => {
  const target = { chargeCycle: 2 }
  const schema = [
    {
      id: 'chargeCycle',
      label: '充電サイクル',
      options: [
        { label: '1回', value: 1 },
        { label: '2回', value: 2 },
      ],
    },
  ]
  const res = parseObject(target, schema)
  expect(res).toEqual({ chargeCycle: '2回' })
})

test('suffix', () => {
  const target = { batteryCapacity: 1 }
  const schema = [
    {
      id: 'batteryCapacity',
      label: '定格容量',
      suffix: 'kWh',
    },
  ]
  const res = parseObject(target, schema)
  expect(res).toEqual({ batteryCapacity: '1kWh' })
})

test('prefix', () => {
  const target = { price: 1 }
  const schema = [
    {
      id: 'price',
      prefix: '¥',
    },
  ]
  const res = parseObject(target, schema)
  expect(res).toEqual({ price: '¥1' })
})

test('nested props', () => {
  const target = { sizes: { d: 1, h: 2 } }
  const schema = [
    {
      id: 'sizes.d',
      suffix: 'm',
    },
  ]
  const res = parseObject(target, schema)
  expect(res).toEqual({ sizes: { d: '1m', h: '2' } })
})

test('options, suffix & prefix', () => {
  const target = { chargeCycle: 2 }
  const schema = [
    {
      id: 'chargeCycle',
      options: [
        { label: '1回', value: 1 },
        { label: '2回', value: 2 },
      ],
      prefix: 'a',
      suffix: 'z',
    },
  ]
  const res = parseObject(target, schema)
  expect(res).toEqual({ chargeCycle: 'a2回z' })
})
