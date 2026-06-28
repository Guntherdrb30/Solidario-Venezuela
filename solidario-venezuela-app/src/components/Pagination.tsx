interface Props {
  page: number;
  pages: number;
  total: number;
  onPage(n: number): void;
}

export function Pagination({ page, pages, total, onPage }: Props) {
  if (pages <= 1) return null;

  const getPageNumbers = () => {
    const nums: (number | '...')[] = [];
    if (pages <= 7) {
      for (let i = 1; i <= pages; i++) nums.push(i);
    } else {
      nums.push(1);
      if (page > 3) nums.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) nums.push(i);
      if (page < pages - 2) nums.push('...');
      nums.push(pages);
    }
    return nums;
  };

  return (
    <div className="mt-8 flex flex-col items-center gap-2">
      <p className="text-xs text-gray-400">{total} resultado{total !== 1 ? 's' : ''} — página {page} de {pages}</p>
      <div className="flex items-center gap-1 flex-wrap justify-center">
        <button
          onClick={() => onPage(page - 1)} disabled={page === 1}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
          ‹ Anterior
        </button>

        {getPageNumbers().map((n, i) =>
          n === '...'
            ? <span key={`dots-${i}`} className="px-2 text-gray-400">…</span>
            : <button
                key={n}
                onClick={() => onPage(n)}
                className={`min-w-[2.25rem] rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                  n === page
                    ? 'border-[#1f7a4d] bg-[#1f7a4d] text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}>
                {n}
              </button>
        )}

        <button
          onClick={() => onPage(page + 1)} disabled={page === pages}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
          Siguiente ›
        </button>
      </div>
    </div>
  );
}
