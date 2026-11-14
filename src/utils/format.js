export const money = value => {
  const number = Number(value)
  if (!Number.isFinite(number)) return '—'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(number)
}
export const number = value => Number(value || 0).toLocaleString('en-IN')
export const titleCase = value => String(value || '').toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
export const asArray = data => Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : [])