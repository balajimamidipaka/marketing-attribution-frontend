import { ArrowUpRight } from 'lucide-react'
export default function MetricCard({ label, value, note, icon: Icon, tone = 'blue' }) {
  return <div className="metric-card">
    <div className="metric-top"><span>{label}</span><div className={`metric-icon ${tone}`}><Icon size={18}/></div></div>
    <strong>{value}</strong><div className="metric-note">{note}<ArrowUpRight size={13}/></div>
  </div>
}