import { useState } from 'react'
import { properties } from '../models/fixtures'
import type { Property } from '../models/types'

export function useProperties() {
  const [list] = useState<Property[]>(properties)
  return { list }
}
