import { useState, useEffect } from 'react'
import { fetchRebalance, saveRebalance, fetchHistory } from './services/api'
import RebalanceScreen from './components/RebalanceScreen'
import HoldingsScreen from './components/HoldingsScreen'
import HistoryScreen from './components/HistoryScreen'

const CLIENT_ID = 'C001'

export default function App() {
  const [activeTab, setActiveTab] = useState(0)
  const [rebalanceData, setRebalanceData] = useState(null)
  const [historyData, setHistoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [rebalance, history] = await Promise.all([
        fetchRebalance(CLIENT_ID),
        fetchHistory(CLIENT_ID),
      ])
      setRebalanceData(rebalance)
      setHistoryData(history)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      setSaving(true)
      await saveRebalance(CLIENT_ID)
      const history = await fetchHistory(CLIENT_ID)
      setHistoryData(history)
      showToast('✓ Rebalancing saved successfully')
    } catch (err) {
      showToast('✗ Failed to save: ' + err.message, true)
    } finally {
      setSaving(false)
    }
  }

  function showToast(msg, isError = false) {
    setToast({ msg, isError })
    setTimeout(() => setToast(null), 3000)
  }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
      height:'100vh', color:'#7a8ba8', fontFamily:'monospace' }}>
      Loading portfolio data...
    </div>
  )

  if (error) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
      height:'100vh', color:'#f04f5e', fontFamily:'monospace' }}>
      Error: {error}
    </div>
  )

  const tabs = ['Rebalance', 'Holdings', 'History']

  return (
    <div style={{ minHeight:'100vh', background:'#0b1220' }}>
      {/* Nav */}
      <nav style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'18px 28px', borderBottom:'1px solid #263552',
        background:'#111c2e'
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{
            width:32, height:32, background:'#4f8ef7', borderRadius:8,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:'monospace', fontWeight:700, color:'#fff', fontSize:14
          }}>WB</div>
          <div>
            <div style={{ fontFamily:'monospace', fontSize:13, fontWeight:700, letterSpacing:'.04em' }}>
              WEALTH BUILDER 2025
            </div>
            <div style={{ fontSize:11, color:'#7a8ba8', marginTop:1 }}>
              Portfolio Rebalancing Tool
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:4 }}>
          {tabs.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)} style={{
              padding:'7px 16px', borderRadius:6, cursor:'pointer',
              fontFamily:'DM Sans, sans-serif', fontSize:13, fontWeight:500,
              background: activeTab === i ? '#1e2d4a' : 'transparent',
              color: activeTab === i ? '#e8edf5' : '#7a8ba8',
              border: activeTab === i ? '1px solid #263552' : '1px solid transparent',
              transition:'all .15s'
            }}>{tab}</button>
          ))}
        </div>
      </nav>

      {/* Screens */}
      <div style={{ padding:28 }}>
        {activeTab === 0 &&
          <RebalanceScreen data={rebalanceData} onSave={handleSave} saving={saving} />}
        {activeTab === 1 &&
          <HoldingsScreen data={rebalanceData} />}
        {activeTab === 2 &&
          <HistoryScreen history={historyData} onRefresh={loadData} />}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position:'fixed', bottom:24, right:24,
          background: toast.isError ? '#f04f5e' : '#22c97a',
          color:'#fff', padding:'12px 20px', borderRadius:8,
          fontSize:13, fontWeight:600, fontFamily:'monospace',
          boxShadow:'0 4px 20px rgba(0,0,0,0.3)',
          animation:'slideUp .3s ease'
        }}>{toast.msg}</div>
      )}
    </div>
  )
}