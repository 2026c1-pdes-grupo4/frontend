import { useState } from 'react'
import type { PropertyInput } from '../models/types'
import './PropertyForm.css'

interface Props {
  initial?: Partial<PropertyInput>
  onSubmit: (data: PropertyInput) => void
  onCancel: () => void
}

const PROPERTY_TYPES = ['APARTMENT', 'HOUSE', 'LAND', 'COMMERCIAL']

export default function PropertyForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<PropertyInput>({
    propertyType: initial?.propertyType ?? 'APARTMENT',
    price: initial?.price ?? 0,
    address: initial?.address ?? '',
    city: initial?.city ?? '',
    province: initial?.province ?? '',
    areaSq: initial?.areaSq ?? 0,
    rooms: initial?.rooms ?? 0,
    description: initial?.description ?? '',
  })

  const set = (key: keyof PropertyInput, value: string | number) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form className="property-form" onSubmit={handleSubmit} data-testid="property-form">
      <div className="form-group">
        <label>Tipo</label>
        <select
          value={form.propertyType}
          onChange={e => set('propertyType', e.target.value)}
          data-testid="input-propertyType"
        >
          {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Dirección</label>
        <input
          value={form.address}
          onChange={e => set('address', e.target.value)}
          required
          data-testid="input-address"
        />
      </div>
      <div className="form-group">
        <label>Ciudad</label>
        <input
          value={form.city}
          onChange={e => set('city', e.target.value)}
          required
          data-testid="input-city"
        />
      </div>
      <div className="form-group">
        <label>Provincia</label>
        <input
          value={form.province}
          onChange={e => set('province', e.target.value)}
          required
          data-testid="input-province"
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Precio (USD)</label>
          <input
            type="number"
            value={form.price}
            onChange={e => set('price', Number(e.target.value))}
            required
            min={0}
            data-testid="input-price"
          />
        </div>
        <div className="form-group">
          <label>Superficie (m²)</label>
          <input
            type="number"
            value={form.areaSq}
            onChange={e => set('areaSq', Number(e.target.value))}
            required
            min={0}
            data-testid="input-areaSq"
          />
        </div>
        <div className="form-group">
          <label>Ambientes</label>
          <input
            type="number"
            value={form.rooms}
            onChange={e => set('rooms', Number(e.target.value))}
            required
            min={0}
            data-testid="input-rooms"
          />
        </div>
      </div>
      <div className="form-group">
        <label>Descripción</label>
        <textarea
          value={form.description}
          onChange={e => set('description', e.target.value)}
          data-testid="input-description"
        />
      </div>
      <div className="form-actions">
        <button type="submit" data-testid="btn-submit-property">Guardar</button>
        <button type="button" onClick={onCancel} data-testid="btn-cancel-property">Cancelar</button>
      </div>
    </form>
  )
}
