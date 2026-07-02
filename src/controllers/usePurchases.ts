import { createPurchase } from '../services/purchaseService'
import { useAuthContext } from '../context/AuthContext'

export function usePurchases() {
  const { token } = useAuthContext()

  const buyProperty = async (agencyPropertyId: number) => {
    if (!token) return
    await createPurchase(token, agencyPropertyId)
  }

  return { buyProperty }
}
