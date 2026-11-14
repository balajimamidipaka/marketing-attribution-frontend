import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowRight, CircleDollarSign, MousePointerClick, Target, UploadCloud } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import api from '../api/client'
import { endpoints } from '../api/endpoints'
import { asArray, money, number, titleCase } from '../utils/format'
import Panel from '../components/Panel'
import MetricCard from '../components/MetricCard'
import { ErrorState, Loading, Empty } from '../components/States'

export default function Overview() {
  const [data,setData] = useState({channels:[],budget:[],uploads:[]})
  const [loading,setLoading] = useState(true)
  const [errors,setErrors] = useState([])
  const load = async () => {
    setLoading(true); setErrors([])
    const tasks = [
      api.get(endpoints.channelPerformance).then(r=>({key:'channels',value:asArray(r.data)})),
      api.get(endpoints.budgetPacing).then(r=>({key:'budget',value:asArray(r.data)})),
      api.get(endpoints.uploads).then(r=>({key:'uploads',value:asArray(r.data)}))
    ]
    const results = await Promise.allSettled(tasks)
    const next = {channels:[],budget:[],uploads:[]}; const failed=[]
    results.forEach((r,i)=> r.status==='fulfilled' ? next[r.value.key]=r.value.value : failed.push(r.reason.message))
    setData(next); setErrors(failed); setLoading(false)
  }
  useEffect(()=>{load()},[])
  const totalSpend = data.channels.reduce((s,r)=>s+Number(r.TOTAL_SPEND||r.totalSpend||0),0)
  const attributedRevenue = data.channels.reduce((s,r)=>s+Number(r.ATTRIBUTED_REVENUE||r.attributedRevenue||0),0)
  const totalConversions = data.channels.reduce((s,r)=>s+Number(r.ATTRIBUTED_CONVERSIONS||r.attributedConversions||0),0)
  const chartData = data.channels.map(r=>({name:r.STANDARD_CHANNEL||r.standardChannel||'Unknown',spend:Number(r.TOTAL_SPEND||r.totalSpend||0),revenue:Number(r.ATTRIBUTED_REVENUE||r.attributedRevenue||0)}))
  const statusCounts = ['ON TRACK','WARNING','UNDERSPENDING'].map(status=>({name:titleCase(status),value:data.budget.filter(r=>(r.PACING_STATUS||r.pacingStatus)===status).length}))
  const colors=['#5b8def','#e9a23b','#27a987']
  if(loading) return <Loading/>
  return <>
    {errors.length>0 && <div className="notice warning">Some overview data could not load: {errors.join(' · ')}. Check endpoint paths in <code>src/api/endpoints.js</code>.</div>}
    <div className="welcome-row"><div><div className="live-label"><span/> LIVE DATA FROM YOUR BACKEND</div><h2>Good day. Here's your marketing snapshot.</h2><p>Performance metrics are calculated from the analytics APIs currently connected.</p></div><button className="button secondary" onClick={load}>Refresh data</button></div>
    <div className="metric-grid">
      <MetricCard label="Total channel spend" value={money(totalSpend)} note="Across returned channels" icon={CircleDollarSign}/>
      <MetricCard label="Attributed revenue" value={money(attributedRevenue)} note="Across returned channels" icon={Target} tone="green"/>
      <MetricCard label="Attributed conversions" value={number(totalConversions)} note="Across returned channels" icon={MousePointerClick} tone="purple"/>
      <MetricCard label="Uploaded files" value={number(data.uploads.length)} note="All registered uploads" icon={UploadCloud} tone="orange"/>
    </div>
    <div className="content-grid two-col">
      <Panel title="Spend vs attributed revenue" subtitle="Channel-level comparison">
        {chartData.length ? <div className="chart-wrap"><ResponsiveContainer width="100%" height={270}><BarChart data={chartData} margin={{top:10,right:10,left:0,bottom:5}}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9edf3"/><XAxis dataKey="name" tick={{fontSize:11,fill:'#7a8496'}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:11,fill:'#7a8496'}} axisLine={false} tickLine={false}/><Tooltip formatter={v=>money(v)}/><Bar dataKey="spend" name="Spend" fill="#9ab8f7" radius={[5,5,0,0]}/><Bar dataKey="revenue" name="Attributed revenue" fill="#426fe0" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></div> : <Empty text="No channel performance records returned."/>}
      </Panel>
      <Panel title="Campaign pacing status" subtitle="Count of campaigns by current status">
        {data.budget.length ? <div className="donut-layout"><ResponsiveContainer width="58%" height={230}><PieChart><Pie data={statusCounts.filter(x=>x.value>0)} dataKey="value" nameKey="name" innerRadius={58} outerRadius={85} paddingAngle={4}>{statusCounts.map((x,i)=><Cell key={x.name} fill={colors[i]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><div className="legend-list">{statusCounts.map((x,i)=><div key={x.name}><i style={{background:colors[i]}}/><span>{x.name}</span><b>{x.value}</b></div>)}</div></div>:<Empty text="No budget pacing records returned."/>}
      </Panel>
    </div>
    <div className="quick-links">
      <Link to="/uploads" className="quick-card"><div className="quick-icon"><UploadCloud/></div><div><b>Upload datasets</b><span>Send CSV files to the ingestion pipeline</span></div><ArrowRight size={17}/></Link>
      <Link to="/budget" className="quick-card"><div className="quick-icon purple"><Activity/></div><div><b>Review budget pacing</b><span>Find campaigns over or under plan</span></div><ArrowRight size={17}/></Link>
    </div>
  </>
}