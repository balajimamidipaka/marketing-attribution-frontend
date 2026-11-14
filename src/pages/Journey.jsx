import {useEffect,useState} from 'react';import {RefreshCw,GitBranch} from 'lucide-react'
import api from '../api/client';import {endpoints} from '../api/endpoints';import {asArray,titleCase} from '../utils/format';import Panel from '../components/Panel';import {Loading,ErrorState,Empty} from '../components/States'
export default function Journey(){
 const [rows,setRows]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState('')
 const load=async()=>{setLoading(true);setError('');try{setRows(asArray((await api.get(endpoints.customerJourney)).data))}catch(e){setError(e.message)}finally{setLoading(false)}}
 useEffect(()=>{load()},[])
 return <><div className="page-intro"><div><h2>Customer journey records</h2><p>Review touchpoint sequences and their relationship to conversions.</p></div><button className="button secondary" onClick={load}><RefreshCw size={15}/> Refresh</button></div>
 {loading?<Loading/>:error?<ErrorState error={error} onRetry={load}/>:rows.length?<Panel title="Journey details" subtitle={`${rows.length} records returned`}><div className="table-wrap"><table><thead><tr>{Object.keys(rows[0]).slice(0,9).map(k=><th key={k}>{titleCase(k)}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{Object.keys(rows[0]).slice(0,9).map(k=><td key={k}>{r[k]===null||r[k]===undefined?'—':String(r[k])}</td>)}</tr>)}</tbody></table></div></Panel>:<Empty text="No customer journey rows returned."/>}</>
}