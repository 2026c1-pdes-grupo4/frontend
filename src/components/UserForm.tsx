import { useState } from 'react'
import type { UserInput } from '../models/types'
import './UserForm.css'

interface Props {
  onSubmit: (data: UserInput) => void
  onCancel: () => void
}

export default function UserForm({ onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<UserInput>({
    username: '',
    email: '',
    password: '',
    profileType: 'BUYER',
  })

  const set = (key: keyof UserInput, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form className="user-form" onSubmit={handleSubmit} data-testid="user-form">
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
        <button type="submit" data-testid="btn-submit-user">Save</button>
        <button type="button" onClick={onCancel} data-testid="btn-cancel-user">Cancel</button>
      </div>
    </form>
  )
}
