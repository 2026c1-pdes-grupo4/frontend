import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePurchases } from '../../src/controllers/usePurchases'
import { createPurchase } from '../../src/services/purchaseService'
import { useAuthContext } from '../../src/context/AuthContext'

vi.mock('../../src/services/purchaseService', () => ({ createPurchase: vi.fn() }))
vi.mock('../../src/context/AuthContext', () => ({ useAuthContext: vi.fn() }))

afterEach(() => {
  vi.mocked(createPurchase).mockReset()
  vi.mocked(useAuthContext).mockReset()
})

describe('usePurchases', () => {
  it('buys a property with the current token', async () => {
    vi.mocked(useAuthContext).mockReturnValue({ token: 'tok', role: 'ROLE_BUYER', setToken: vi.fn() })
    vi.mocked(createPurchase).mockResolvedValue({} as never)

    const { result } = renderHook(() => usePurchases())
    await result.current.buyProperty(7)

    expect(createPurchase).toHaveBeenCalledWith('tok', 7)
  })

  it('does nothing when there is no token', async () => {
    vi.mocked(useAuthContext).mockReturnValue({ token: null, role: null, setToken: vi.fn() })

    const { result } = renderHook(() => usePurchases())
    await result.current.buyProperty(7)

    expect(createPurchase).not.toHaveBeenCalled()
  })
})
