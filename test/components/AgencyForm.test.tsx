import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AgencyForm from '../../src/components/AgencyForm'

describe('AgencyForm', () => {
  it('starts with default empty values', () => {
    render(<AgencyForm onSubmit={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByTestId('input-username')).toHaveValue('')
    expect(screen.getByTestId('input-email')).toHaveValue('')
    expect(screen.getByTestId('input-password')).toHaveValue('')
  })

  it('submits the entered form data', () => {
    const onSubmit = vi.fn()
    render(<AgencyForm onSubmit={onSubmit} onCancel={vi.fn()} />)

    fireEvent.change(screen.getByTestId('input-username'), { target: { value: 'nueva_inmo' } })
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'nueva@cth.com' } })
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByTestId('btn-submit-agency'))

    expect(onSubmit).toHaveBeenCalledWith({
      username: 'nueva_inmo',
      email: 'nueva@cth.com',
      password: 'secret123',
    })
  })

  it('pre-fills fields from the initial value', () => {
    render(<AgencyForm initial={{ username: 'existing_inmo', email: 'existing@cth.com' }} onSubmit={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByTestId('input-username')).toHaveValue('existing_inmo')
    expect(screen.getByTestId('input-email')).toHaveValue('existing@cth.com')
  })

  it('calls onCancel when Cancel is clicked', () => {
    const onCancel = vi.fn()
    render(<AgencyForm onSubmit={vi.fn()} onCancel={onCancel} />)

    fireEvent.click(screen.getByTestId('btn-cancel-agency'))

    expect(onCancel).toHaveBeenCalled()
  })
})
