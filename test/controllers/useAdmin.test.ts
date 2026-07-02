import { describe, it, expect, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { useAdminData } from '../../src/controllers/useAdmin'

describe('useAdminData', () => {
  it('does not fetch while inactive', () => {
    const fetcher = vi.fn().mockResolvedValue([])
    renderHook(() => useAdminData(fetcher, 'tok', false))

    expect(fetcher).not.toHaveBeenCalled()
  })

  it('fetches when active with a token', async () => {
    // NOTE: on first mount with active=true, `loading` never flips true — the
    // hook's change-detection seeds prevActive/prevToken from the initial
    // props, so the first render doesn't count as a "change". Wait on the
    // actual result instead of the loading flag.
    const fetcher = vi.fn().mockResolvedValue([{ id: 1 }])
    const { result } = renderHook(() => useAdminData(fetcher, 'tok', true))

    await waitFor(() => expect(result.current.data).toEqual([{ id: 1 }]))

    expect(fetcher).toHaveBeenCalledWith('tok')
    expect(result.current.error).toBeNull()
  })

  it('sets an error message when the fetcher rejects', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('Server error - please try again later.'))
    const { result } = renderHook(() => useAdminData(fetcher, 'tok', true))

    await waitFor(() => expect(result.current.error).toBe('Server error - please try again later.'))
  })

  it('re-fetches when switching from inactive to active', async () => {
    const fetcher = vi.fn().mockResolvedValue([{ id: 1 }])
    const { result, rerender } = renderHook(
      ({ active }) => useAdminData(fetcher, 'tok', active),
      { initialProps: { active: false } },
    )

    expect(fetcher).not.toHaveBeenCalled()

    act(() => rerender({ active: true }))
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(fetcher).toHaveBeenCalledTimes(1)
    expect(result.current.data).toEqual([{ id: 1 }])
  })
})
