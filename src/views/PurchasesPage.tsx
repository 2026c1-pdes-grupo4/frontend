import { useState } from 'react'
import { usePurchases } from '../controllers/usePurchases'
import { Pager } from '../components/Pager'
import { usePagination, DEFAULT_PAGE_SIZE } from '../hooks/usePagination'
import ErrorBanner from '../components/ErrorBanner'
import '../components/PropertyCard.css'
import './PurchasesPage.css'

export default function PurchasesPage() {
  const { list, loading, error } = usePurchases()
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const pagination = usePagination(list, pageSize)

  if (loading) return <p>Loading...</p>
  if (error) return <ErrorBanner message={error} />
  if (list.length === 0) return <p className="purchases-empty">No purchases yet.</p>

  return (
    <div className="purchases-page">
      <h2>My Purchases</h2>
      <div className="purchases-list">
        {pagination.pagedData.map((purchase) => (
          <div key={purchase.id} className="property-card">
            <div className="property-card__body">
              <div className="property-card__row">
                <span className="property-card__address">{purchase.propertyAddress}</span>
                <span className="purchases-badge">Purchased</span>
              </div>

              <div className="property-card__row">
                <span className="property-card__city">{purchase.agencyName}</span>
                <span className="property-card__price">${purchase.purchasePrice.toLocaleString('en-US')}</span>
              </div>

              <div className="property-card__row">
                <span className="purchases-date">Date: {purchase.purchaseDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pager p={pagination} pageSize={pageSize} onPageSize={setPageSize} />
    </div>
  )
}
