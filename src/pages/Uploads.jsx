import { useEffect, useState } from 'react'
import { CloudUpload, FileSpreadsheet, RefreshCw } from 'lucide-react'
import api from '../api/client'
import { endpoints } from '../api/endpoints'
import { asArray, number, titleCase } from '../utils/format'
import Panel from '../components/Panel'
import { ErrorState, Loading, Empty } from '../components/States'

const types=['CAMPAIGNS','CAMPAIGN_SPEND','CHANNEL_MAPPING','CONVERSIONS','TOUCHPOINTS']
export default function Uploads(){
  const [uploads,setUploads]=useState([]); const [file,setFile]=useState(null); const [type,setType]=useState(types[0])
  const [loading,setLoading]=useState(true); const [busy,setBusy]=useState(false); const [error,setError]=useState(''); const [message,setMessage]=useState('')
  const load=async()=>{setLoading(true);setError('');try{const r=await api.get(endpoints.uploads);setUploads(asArray(r.data))}catch(e){setError(e.message)}finally{setLoading(false)}}
  useEffect(()=>{load()},[])
  const submit=async e=>{e.preventDefault();if(!file){setError('Choose a CSV file first.');return}setBusy(true);setError('');setMessage('')
    try{const body=new FormData();body.append('file',file);body.append('datasetType',type);await api.post(endpoints.uploads,body,{headers:{'Content-Type':'multipart/form-data'}});setMessage('File uploaded. The backend scheduler will process it automatically.');setFile(null);e.target.reset();await load()}
    catch(err){setError(err.message)}finally{setBusy(false)}
  }
  return <>
    <div className="page-intro"><div><h2>Upload source data</h2><p>Choose the dataset category and upload its CSV file. Processing is handled by your Spring Boot scheduler.</p></div><button className="button secondary" onClick={load}><RefreshCw size={15}/> Refresh</button></div>
    <div className="content-grid upload-grid">
      <Panel title="New CSV upload" subtitle="Accepted dataset types">
        <form className="upload-form" onSubmit={submit}>
          <label className="field-label">Dataset type</label>
          <select value={type} onChange={e=>setType(e.target.value)}>{types.map(t=><option key={t} value={t}>{titleCase(t)}</option>)}</select>
          <label className="field-label">CSV file</label>
          <label className="file-drop"><input type="file" accept=".csv,text/csv" onChange={e=>setFile(e.target.files?.[0]||null)}/><div className="drop-icon"><CloudUpload size={25}/></div><b>{file?file.name:'Choose a CSV file'}</b><span>{file?`${(file.size/1024).toFixed(1)} KB`:'Click to browse · CSV format'}</span></label>
          <button className="button primary full" disabled={busy}>{busy?'Uploading…':<><CloudUpload size={16}/> Upload file</>}</button>
        </form>
        {message&&<div className="notice success">{message}</div>}{error&&<div className="notice danger">{error}</div>}
      </Panel>
      <Panel title="Pipeline overview" subtitle="Your current ingestion flow">
        <div className="pipeline"><div><span>01</span><b>React upload</b><small>Multipart request</small></div><i>→</i><div><span>02</span><b>Spring Boot</b><small>Validate and register</small></div><i>→</i><div><span>03</span><b>Amazon S3</b><small>Private CSV storage</small></div><i>→</i><div><span>04</span><b>Snowflake</b><small>RAW and analytics</small></div></div>
        <div className="pipeline-note"><FileSpreadsheet size={17}/> Five supported datasets: campaigns, spend, channel mapping, conversions and touchpoints.</div>
      </Panel>
    </div>
    <Panel title="Upload history" subtitle="Latest upload records">
      {loading?<Loading/>:error&&!uploads.length?<ErrorState error={error} onRetry={load}/>:uploads.length?<div className="table-wrap"><table><thead><tr><th>File</th><th>Dataset</th><th>Status</th><th>Rows loaded</th><th>Uploaded</th></tr></thead><tbody>{uploads.map((u,i)=><tr key={u.uploadId||u.UPLOAD_ID||i}><td><b>{u.fileName||u.FILE_NAME||'—'}</b><small className="sub-cell">{u.uploadId||u.UPLOAD_ID||''}</small></td><td>{titleCase(u.datasetType||u.DATASET_TYPE)}</td><td><span className={`status ${String(u.processingStatus||u.PROCESSING_STATUS||'').toLowerCase()}`}>{titleCase(u.processingStatus||u.PROCESSING_STATUS||'Unknown')}</span></td><td>{number(u.loadedRows??u.LOADED_ROWS)}</td><td>{u.uploadedAt||u.UPLOADED_AT?new Date(u.uploadedAt||u.UPLOADED_AT).toLocaleString():'—'}</td></tr>)}</tbody></table></div>:<Empty text="No uploads registered yet."/>}
    </Panel>
  </>
}