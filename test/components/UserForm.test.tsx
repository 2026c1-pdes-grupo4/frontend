import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import UserForm from '../../src/components/UserForm'

describe('UserForm', () => {
  it('starts with default empty values', () => {
    render(<UserForm onSubmit={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByTestId('input-username')).toHaveValue('')
    expect(screen.getByTestId('input-email')).toHaveValue('')
    expect(screen.getByTestId('input-password')).toHaveValue('')
  })

  it('has no profile type selector - only buyers can be created here', () => {
    render(<UserForm onSubmit={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.queryByTestId('input-profileType')).not.toBeInTheDocument()
  })

  it('submits the entered form data with profileType fixed to BUYER', () => {
    const onSubmit = vi.fn()
    render(<UserForm onSubmit={onSubmit} onCancel={vi.fn()} />)

    fireEvent.change(screen.getByTestId('input-username'), { target: { value: 'nuevo' } })
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'nuevo@cth.com' } })
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByTestId('btn-submit-user'))

    expect(onSubmit).toHaveBeenCalledWith({
      username: 'nuevo',
      email: 'nuevo@cth.com',
      password: 'secret123',
      profileType: 'BUYER',
    })
  })

  it('pre-fills fields from the initial value, keeping the existing profileType', () => {
    render(<UserForm initial={{ username: 'existing', email: 'existing@cth.com', profileType: 'ADMIN' }} onSubmit={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByTestId('input-username')).toHaveValue('existing')
    expect(screen.getByTestId('input-email')).toHaveValue('existing@cth.com')
  })

  it('submits the existing profileType unchanged when editing', () => {
    const onSubmit = vi.fn()
    render(<UserForm initial={{ username: 'existing', email: 'existing@cth.com', profileType: 'ADMIN' }} onSubmit={onSubmit} onCancel={vi.fn()} />)

    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByTestId('btn-submit-user'))

    expect(onSubmit).toHaveBeenCalledWith({
      username: 'existing',
      email: 'existing@cth.com',
      password: 'secret123',
      profileType: 'ADMIN',
    })
  })

  it('calls onCancel when Cancel is clicked', () => {
    const onCancel = vi.fn()
    render(<UserForm onSubmit={vi.fn()} onCancel={onCancel} />)

    fireEvent.click(screen.getByTestId('btn-cancel-user'))

    expect(onCancel).toHaveBeenCalled()
  })
})
