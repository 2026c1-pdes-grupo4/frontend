import { useState } from 'react'
import type { PropertyInput } from '../models/types'
import './PropertyForm.css'

interface Props {
  initial?: Partial<PropertyInput>
  onSubmit: (data: PropertyInput) => void
  onCancel: () => void
}

const PROPERTY_TYPES = ['APARTMENT', 'HOUSE']

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
    circumscription: initial?.circumscription ?? '',
    section: initial?.section ?? '',
    block: initial?.block ?? '',
    parcel: initial?.parcel ?? '',
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
        <label>Type</label>
        <select
          value={form.propertyType}
          onChange={e => set('propertyType', e.target.value)}
          data-testid="input-propertyType"
        >
          {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Address</label>
        <input
          value={form.address}
          onChange={e => set('address', e.target.value)}
          required
          data-testid="input-address"
        />
      </div>
      <div className="form-group">
        <label>City</label>
        <input
          value={form.city}
          onChange={e => set('city', e.target.value)}
          required
          data-testid="input-city"
        />
      </div>
      <div className="form-group">
        <label>Province</label>
        <input
          value={form.province}
          onChange={e => set('province', e.target.value)}
          required
          data-testid="input-province"
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Price (USD)</label>
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
          <label>Area (m²)</label>
          <input
            type="number"
            value={form.areaSq}
            onChange={e => set('areaSq', Number(e.target.value))}
            required
            min={0}
            data-testid="input-areaSq"
          />
        </div>
        <div className="form-group form-group--narrow">
          <label>Rooms</label>
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
        <label>Description</label>
        <textarea
          value={form.description}
          onChange={e => set('description', e.target.value)}
          data-testid="input-description"
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Circumscription</label>
          <input
            value={form.circumscription}
            onChange={e => set('circumscription', e.target.value)}
            data-testid="input-circumscription"
          />
        </div>
        <div className="form-group">
          <label>Section</label>
          <input
            value={form.section}
            onChange={e => set('section', e.target.value)}
            data-testid="input-section"
          />
        </div>
        <div className="form-group">
          <label>Block</label>
          <input
            value={form.block}
            onChange={e => set('block', e.target.value)}
            data-testid="input-block"
          />
        </div>
        <div className="form-group">
          <label>Parcel</label>
          <input
            value={form.parcel}
            onChange={e => set('parcel', e.target.value)}
            data-testid="input-parcel"
          />
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" data-testid="btn-submit-property">Save</button>
        <button type="button" onClick={onCancel} data-testid="btn-cancel-property">Cancel</button>
      </div>
    </form>
  )
}
