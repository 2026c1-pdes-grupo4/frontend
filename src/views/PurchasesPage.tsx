import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMyPurchases } from '../controllers/usePurchases'
import { Pager } from '../components/Pager'
import { usePagination, DEFAULT_PAGE_SIZE } from '../hooks/usePagination'
import './PurchasesPage.css'

export default function PurchasesPage() {
  const { list, loading, error } = useMyPurchases()
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const pagination = usePagination(list, pageSize)

  if (loading) return (
    <div className="purchases-page" aria-busy="true">
      <p className="purchases-status" role="status">Loading...</p>
    </div>
  )

  if (error) return (
    <div className="purchases-page">
      <p className="purchases-status purchases-status--error" role="alert">Error: {error}</p>
    </div>
  )

  if (list.length === 0) return (
    <div className="purchases-page">
      <div className="purchases-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
          <path d="M9 21V12h6v9" />
        </svg>
        <p>You haven't purchased any properties yet.</p>
        <Link to="/properties">Browse properties</Link>
      </div>
    </div>
  )

  return (
    <div className="purchases-page" data-testid="purchases-page">
      <h2 className="purchases-title">My Purchases</h2>
      <div className="purchases-table-wrap">
        <table className="purchases-table" data-testid="purchases-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Property</th>
              <th>Agency</th>
              <th>Price</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {pagination.pagedData.map((p, i) => (
              <tr key={p.id} className="animate-in" data-testid="purchase-row" style={{ animationDelay: `${i * 60}ms` }}>
                <td>{p.id}</td>
                <td>{p.propertyAddress}</td>
                <td>{p.agencyName}</td>
                <td className="purchases-price">USD {p.purchasePrice.toLocaleString()}</td>
                <td>{p.purchaseDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pager p={pagination} pageSize={pageSize} onPageSize={setPageSize} />
    </div>
  )
}
