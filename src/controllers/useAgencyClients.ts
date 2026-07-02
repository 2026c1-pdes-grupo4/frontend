import { useAgencyPurchases } from './useAgencyPurchases'
import type { AgencyClient } from '../models/types'

export function useAgencyClients() {
  const { list: purchases, loading, error } = useAgencyPurchases()

  const list: AgencyClient[] = Array.from(
    new Map(purchases.map((p) => [p.buyerId, p])).values()
  ).map((p) => ({
    agencyId: p.agencyId,
    userId: p.buyerId,
    username: p.buyerUsername,
    email: p.buyerEmail,
  }))

  return { list, loading, error }
}
