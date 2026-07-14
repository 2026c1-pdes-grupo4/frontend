import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePagination, PAGE_SIZE_OPTIONS } from '../hooks/usePagination'

type PaginationState = ReturnType<typeof usePagination>

export function Pager({ p, pageSize, onPageSize }: { p: PaginationState; pageSize: number; onPageSize: (n: number) => void }) {
  return (
    <div className="pagination">
      <button data-testid="btn-prev-page" disabled={p.page === 1} onClick={p.prev}>
        <ChevronLeft size={18} />
      </button>
      <span data-testid="page-indicator">{p.page} / {p.totalPages}</span>
      <button data-testid="btn-next-page" disabled={p.page === p.totalPages} onClick={p.next}>
        <ChevronRight size={18} />
      </button>
      <select value={pageSize} onChange={e => onPageSize(Number(e.target.value))}>
        {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n} per page</option>)}
      </select>
    </div>
  )
}
