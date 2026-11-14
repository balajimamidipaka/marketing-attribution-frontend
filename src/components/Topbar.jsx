import { Bell, Search, CircleHelp } from 'lucide-react'
export default function Topbar({ title, subtitle }) {
  return <header className="topbar">
    <div><div className="eyebrow">MARKETING ANALYTICS / {title.toUpperCase()}</div><h1>{title}</h1><p>{subtitle}</p></div>
    <div className="top-actions">
      <div className="search-box"><Search size={16}/><span>Analytics workspace</span><kbd>API</kbd></div>
      <button className="icon-button" title="Help"><CircleHelp size={18}/></button>
      <button className="icon-button" title="Notifications"><Bell size={18}/></button>
      <div className="avatar">MA</div>
    </div>
  </header>
}