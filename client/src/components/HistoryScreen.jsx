export default function HistoryScreen({ history, onRefresh }) {
  const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN')

  const statusStyle = {
    APPLIED:   { bg:'#0d2e1e', color:'#22c97a', border:'rgba(34,201,122,.2)' },
    PENDING:   { bg:'#0d1e38', color:'#4f8ef7', border:'rgba(79,142,247,.2)' },
    DISMISSED: { bg:'#1a1a1a', color:'#4a5d7a', border:'#263552' },
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:600 }}>Rebalancing History</div>
          <div style={{ fontSize:12, color:'#7a8ba8', marginTop:3, fontFamily:'monospace' }}>
            Past recommendations for Amit Sharma
          </div>
        </div>
        <button onClick={onRefresh} style={{
          padding:'7px 14px', background:'transparent',
          border:'1px solid #263552', borderRadius:6,
          color:'#7a8ba8', cursor:'pointer', fontSize:12, fontFamily:'monospace'
        }}>↺ Refresh</button>
      </div>

      {history.length === 0 ? (
        <div style={{ padding:48, textAlign:'center', color:'#4a5d7a', fontSize:13,
          background:'#111c2e', border:'1px solid #263552', borderRadius:10 }}>
          No rebalancing history yet. Save a recommendation from the Rebalance tab.
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {history.map(session => {
            const s = statusStyle[session.status] || statusStyle.PENDING
            return (
              <div key={session.session_id} style={{
                background:'#111c2e', border:'1px solid #263552',
                borderRadius:10, padding:'18px 20px'
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <div style={{ fontFamily:'monospace', fontSize:12, color:'#7a8ba8' }}>
                      {session.created_at}
                    </div>
                    <div style={{ fontFamily:'monospace', fontSize:18, fontWeight:700, marginTop:6 }}>
                      {fmt(session.portfolio_value)}
                    </div>
                    <div style={{ fontSize:12, color:'#7a8ba8', marginTop:4 }}>
                      Portfolio value at time of recommendation
                    </div>
                  </div>
                  <span style={{
                    padding:'3px 10px', borderRadius:4,
                    background:s.bg, color:s.color,
                    border:`1px solid ${s.border}`,
                    fontSize:11, fontWeight:600, fontFamily:'monospace'
                  }}>{session.status}</span>
                </div>
                <div style={{ display:'flex', gap:8, marginTop:12, flexWrap:'wrap' }}>
                  <span style={{ padding:'4px 10px', borderRadius:4, fontSize:11,
                    fontFamily:'monospace', background:'#0d2e1e', color:'#22c97a' }}>
                    Buy {fmt(session.total_to_buy)}
                  </span>
                  <span style={{ padding:'4px 10px', borderRadius:4, fontSize:11,
                    fontFamily:'monospace', background:'#2e0d12', color:'#f04f5e' }}>
                    Sell {fmt(session.total_to_sell)}
                  </span>
                  <span style={{ padding:'4px 10px', borderRadius:4, fontSize:11,
                    fontFamily:'monospace', background:'#0d1e38', color:'#4f8ef7' }}>
                    Cash needed {fmt(session.net_cash_needed)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}