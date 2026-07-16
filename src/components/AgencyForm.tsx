import { useState } from 'react'
import type { AgencyInput } from '../models/types'
import './AgencyForm.css'

interface Props {
  initial?: Partial<AgencyInput>
  onSubmit: (data: AgencyInput) => void
  onCancel: () => void
}

export default function AgencyForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<AgencyInput>({
    username: initial?.username ?? '',
    email: initial?.email ?? '',
    password: '',
  })

  const set = (key: keyof AgencyInput, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form className="agency-form" onSubmit={handleSubmit} data-testid="agency-form">
      <div className="form-group">
        <label>Username</label>
        <input
          value={form.username}
          onChange={e => set('username', e.target.value)}
          required
          data-testid="input-username"
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={e => set('email', e.target.value)}
          required
          data-testid="input-email"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={e => set('password', e.target.value)}
          required
          data-testid="input-password"
        />
      </div>
      <div className="form-actions">
        <button type="submit" data-testid="btn-submit-agency">Save</button>
        <button type="button" onClick={onCancel} data-testid="btn-cancel-agency">Cancel</button>
      </div>
    </form>
  )
}
