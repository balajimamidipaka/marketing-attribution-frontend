import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Overview from './pages/Overview'
import Uploads from './pages/Uploads'
import Attribution from './pages/Attribution'
import Channels from './pages/Channels'
import Budget from './pages/Budget'
import Journey from './pages/Journey'
import Alerts from './pages/Alerts'

const pageMeta = {
  '/': ['Overview', 'A clear view of attribution performance and campaign health.'],
  '/uploads': ['Data uploads', 'Upload source datasets and monitor automated processing.'],
  '/attribution': ['Attribution results', 'Compare conversion credit across attribution models.'],
  '/channels': ['Channel performance', 'Understand spend, attributed revenue and return by channel.'],
  '/budget': ['Budget pacing', 'Monitor actual spend against expected campaign budgets.'],
  '/journey': ['Customer journey', 'Explore touchpoints that lead to conversions.'],
  '/alerts': ['Campaign alerts', 'Review campaigns that may need budget or performance attention.']
}

export default function App() {
  const location = useLocation()
  const [title, subtitle] = pageMeta[location.pathname] || pageMeta['/']
  useEffect(() => { document.title = `${title} | AttributionIQ` }, [title])
  return <div className="app-shell">
    <Sidebar/>
    <main className="main-area">
      <Topbar title={title} subtitle={subtitle}/>
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Overview/>}/>
          <Route path="/uploads" element={<Uploads/>}/>
          <Route path="/attribution" element={<Attribution/>}/>
          <Route path="/channels" element={<Channels/>}/>
          <Route path="/budget" element={<Budget/>}/>
          <Route path="/journey" element={<Journey/>}/>
          <Route path="/alerts" element={<Alerts/>}/>
        </Routes>
      </div>
      <footer className="footer"><span>AttributionIQ</span><span>Connected to Spring Boot · Snowflake analytics</span></footer>
    </main>
  </div>
}