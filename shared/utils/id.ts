import { createId } from '@paralleldrive/cuid2'

export const createDomainId = (prefix?: string) => {
  return `${prefix ?? ''}${createId()}`
}

export const randomNumberBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)
