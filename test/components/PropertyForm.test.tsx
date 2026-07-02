import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PropertyForm from '../../src/components/PropertyForm'

describe('PropertyForm', () => {
  it('starts with default empty values', () => {
    render(<PropertyForm onSubmit={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByTestId('input-address')).toHaveValue('')
    expect(screen.getByTestId('input-propertyType')).toHaveValue('APARTMENT')
    expect(screen.getByTestId('input-price')).toHaveValue(0)
  })

  it('pre-fills fields from the initial value', () => {
    render(<PropertyForm initial={{ address: 'Calle 1', price: 5000 }} onSubmit={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByTestId('input-address')).toHaveValue('Calle 1')
    expect(screen.getByTestId('input-price')).toHaveValue(5000)
  })

  it('submits the edited form data', () => {
    const onSubmit = vi.fn()
    render(<PropertyForm onSubmit={onSubmit} onCancel={vi.fn()} />)

    fireEvent.change(screen.getByTestId('input-address'), { target: { value: 'Calle 2' } })
    fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'Quilmes' } })
    fireEvent.change(screen.getByTestId('input-province'), { target: { value: 'BA' } })
    fireEvent.change(screen.getByTestId('input-price'), { target: { value: '2000' } })
    fireEvent.change(screen.getByTestId('input-areaSq'), { target: { value: '80' } })
    fireEvent.change(screen.getByTestId('input-rooms'), { target: { value: '3' } })
    fireEvent.click(screen.getByTestId('btn-submit-property'))

    expect(onSubmit).toHaveBeenCalledWith({
      propertyType: 'APARTMENT',
      address: 'Calle 2',
      city: 'Quilmes',
      province: 'BA',
      price: 2000,
      areaSq: 80,
      rooms: 3,
      description: '',
    })
  })

  it('calls onCancel when Cancel is clicked', () => {
    const onCancel = vi.fn()
    render(<PropertyForm onSubmit={vi.fn()} onCancel={onCancel} />)

    fireEvent.click(screen.getByTestId('btn-cancel-property'))

    expect(onCancel).toHaveBeenCalled()
  })
})
