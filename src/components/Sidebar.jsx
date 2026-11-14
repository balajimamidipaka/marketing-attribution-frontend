import { NavLink } from 'react-router-dom'
import { Activity, BarChart3, Bell, BriefcaseBusiness, ChevronLeft, CloudUpload, GitBranch, LayoutDashboard, Target } from 'lucide-react'

const links = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/uploads', label: 'Data uploads', icon: CloudUpload },
  { to: '/attribution', label: 'Attribution results', icon: Target },
  { to: '/channels', label: 'Channel performance', icon: BarChart3 },
  { to: '/budget', label: 'Budget pacing', icon: Activity },
  { to: '/journey', label: 'Customer journey', icon: GitBranch },
  { to: '/alerts', label: 'Campaign alerts', icon: Bell }
]

export default function Sidebar() {
  return <aside className="sidebar">
    <div className="brand">
      <div className="brand-mark"><Target size={21}/></div>
      <div><strong>Attribution<span>IQ</span></strong><small>MARKETING INTELLIGENCE</small></div>
    </div>
    <div className="workspace-label">WORKSPACE</div>
    <nav>{links.map(({to,label,icon:Icon,end}) =>
      <NavLink key={to} to={to} end={end} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
        <Icon size={18}/><span>{label}</span>{label === 'Campaign alerts' && <i className="nav-dot"/>}
      </NavLink>
    )}</nav>
    <div className="sidebar-bottom">
      <div className="status-pill"><span/> API workspace</div>
      <div className="sidebar-foot">Marketing attribution<br/>and budget intelligence</div>
    </div>
  </aside>
}