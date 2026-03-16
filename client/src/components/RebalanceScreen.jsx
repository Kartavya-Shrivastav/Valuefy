export default function RebalanceScreen({ data, onSave, saving }) {
  if (!data) return null
  const { client, totalValue, totalToBuy, totalToSell, netCashNeeded, items } = data

  const fmt = (n) => '₹' + Math.abs(Math.round(n)).toLocaleString('en-IN')

  return (
    <div>
      {/* Client header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:600 }}>{client.client_name}</div>
          <div style={{ fontSize:12, color:'#7a8ba8', marginTop:3, fontFamily:'monospace' }}>
            CLIENT ID: {client.client_id} · Plan: Wealth Builder 2025
          </div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:11, color:'#7a8ba8', textTransform:'uppercase', letterSpacing:'.08em' }}>
            Total Portfolio Value
          </div>
          <div style={{ fontFamily:'monospace', fontSize:28, fontWeight:700, marginTop:2 }}>
            {fmt(totalValue)}
          </div>
        </div>
      </div>

      {/* Allocation bar */}
      <div style={{ display:'flex', height:6, borderRadius:3, overflow:'hidden', gap:2, marginBottom:24 }}>
        {items.map((item, i) => {
          const colors = ['#4f8ef7','#a855f7','#22c97a','#f5a623','#f59e0b','#64748b']
          return (
            <div key={item.fund_id} style={{
              flex: item.current_pct || 0.1,
              background: colors[i % colors.length],
              borderRadius:2
            }} title={`${item.fund_name}: ${item.current_pct}%`} />
          )
        })}
      </div>

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:24 }}>
        {[
          { label:'Total to Buy',      val: fmt(totalToBuy),      color:'#22c97a', sub:'Mirae Asset + HDFC Mid Cap' },
          { label:'Total to Sell',     val: fmt(totalToSell),     color:'#f04f5e', sub:'Parag Parikh + ICICI + Nippon Gold' },
          { label:'Fresh Cash Needed', val: fmt(netCashNeeded),   color:'#4f8ef7', sub:'Total Buy − Total Sell' },
        ].map(card => (
          <div key={card.label} style={{
            background:'#111c2e', border:'1px solid #263552',
            borderRadius:10, padding:'16px 20px'
          }}>
            <div style={{ fontSize:11, color:'#7a8ba8', textTransform:'uppercase', letterSpacing:'.08em' }}>
              {card.label}
            </div>
            <div style={{ fontFamily:'monospace', fontSize:20, fontWeight:700, color:card.color, marginTop:6 }}>
              {card.val}
            </div>
            <div style={{ fontSize:11, color:'#4a5d7a', marginTop:4 }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background:'#111c2e', border:'1px solid #263552', borderRadius:10, overflow:'hidden' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
          padding:'14px 20px', borderBottom:'1px solid #263552' }}>
          <span style={{ fontSize:13, fontWeight:600 }}>Rebalancing Recommendations</span>
          <button onClick={onSave} disabled={saving} style={{
            padding:'8px 18px', background: saving ? '#22c97a' : '#4f8ef7',
            color:'#fff', border:'none', borderRadius:6,
            fontFamily:'DM Sans, sans-serif', fontSize:13, fontWeight:600,
            cursor: saving ? 'default' : 'pointer', opacity: saving ? .8 : 1,
            transition:'all .15s'
          }}>
            {saving ? '✓ Saving...' : 'Save Rebalancing'}
          </button>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid #263552' }}>
              {['Fund','Plan %','Today %','Drift','Action','Amount'].map((h, i) => (
                <th key={h} style={{
                  padding:'10px 16px', textAlign: i > 0 ? 'right' : 'left',
                  fontSize:11, fontWeight:500, color:'#7a8ba8',
                  textTransform:'uppercase', letterSpacing:'.07em'
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const actionColors = { BUY:'#22c97a', SELL:'#f04f5e', REVIEW:'#f5a623', HOLD:'#7a8ba8' }
              const actionBg = { BUY:'#0d2e1e', SELL:'#2e0d12', REVIEW:'#2e2008', HOLD:'#1a1a1a' }
              const color = actionColors[item.action]
              const driftStr = item.drift === null ? '—'
                : (item.drift > 0 ? '+' : '') + item.drift.toFixed(1) + '%'
              const amtStr = item.action === 'REVIEW'
                ? '₹' + item.amount.toLocaleString('en-IN')
                : (item.action === 'BUY' ? '+' : '-') + '₹' + item.amount.toLocaleString('en-IN')

              return (
                <tr key={item.fund_id} style={{ borderBottom:'1px solid #1a2540' }}>
                  <td style={{ padding:'13px 16px' }}>
                    <div style={{ fontWeight:500 }}>{item.fund_name}</div>
                    <div style={{ fontFamily:'monospace', fontSize:11, color:'#4a5d7a', marginTop:2 }}>
                      {item.fund_id}
                    </div>
                  </td>
                  <td style={{ padding:'13px 16px', textAlign:'right', fontFamily:'monospace',
                    fontSize:12, color:'#7a8ba8' }}>
                    {item.target_pct !== null ? item.target_pct + '%' : '—'}
                  </td>
                  <td style={{ padding:'13px 16px', textAlign:'right', fontFamily:'monospace', fontSize:12 }}>
                    {item.current_pct}%
                  </td>
                  <td style={{ padding:'13px 16px', textAlign:'right' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:8 }}>
                      <span style={{
                        fontFamily:'monospace', fontSize:12, fontWeight:700,
                        color: item.drift === null ? '#7a8ba8' : item.drift > 0 ? '#22c97a' : '#f04f5e'
                      }}>{driftStr}</span>
                      {item.drift !== null && (
                        <div style={{ width:50, height:4, background:'#1e2d4a', borderRadius:2, overflow:'hidden' }}>
                          <div style={{
                            width: Math.min(Math.abs(item.drift) / 20 * 100, 100) + '%',
                            height:'100%', borderRadius:2,
                            background: item.drift > 0 ? '#22c97a' : '#f04f5e'
                          }} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding:'13px 16px', textAlign:'right' }}>
                    <span style={{
                      display:'inline-flex', alignItems:'center',
                      padding:'3px 10px', borderRadius:4,
                      background: actionBg[item.action],
                      color, border:`1px solid ${color}33`,
                      fontFamily:'monospace', fontSize:11, fontWeight:700, letterSpacing:'.05em'
                    }}>{item.action}</span>
                  </td>
                  <td style={{ padding:'13px 16px', textAlign:'right',
                    fontFamily:'monospace', fontSize:13, fontWeight:700, color }}>
                    {amtStr}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}