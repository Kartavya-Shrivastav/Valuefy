export default function HoldingsScreen({ data }) {
  if (!data) return null
  const { client, totalValue, items } = data
  const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN')

  const sorted = [...items].sort((a, b) => b.current_value - a.current_value)
  const assetColor = { EQUITY:'#4f8ef7', DEBT:'#f5a623', GOLD:'#f59e0b' }

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:22, fontWeight:600 }}>Current Holdings</div>
        <div style={{ fontSize:12, color:'#7a8ba8', marginTop:3, fontFamily:'monospace' }}>
          {client.client_name} · {client.client_id} · All funds including out-of-plan
        </div>
      </div>

      <div style={{ background:'#111c2e', border:'1px solid #263552', borderRadius:10, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid #263552' }}>
              {['Fund ID','Fund Name','Asset Class','Current Value','% of Portfolio','In Plan?'].map((h,i) => (
                <th key={h} style={{
                  padding:'10px 16px', textAlign: i > 1 ? 'right' : 'left',
                  fontSize:11, fontWeight:500, color:'#7a8ba8',
                  textTransform:'uppercase', letterSpacing:'.07em'
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(item => (
              <tr key={item.fund_id} style={{ borderBottom:'1px solid #1a2540' }}>
                <td style={{ padding:'13px 16px', fontFamily:'monospace', fontSize:11, color:'#7a8ba8' }}>
                  {item.fund_id}
                </td>
                <td style={{ padding:'13px 16px', fontWeight:500 }}>{item.fund_name}</td>
                <td style={{ padding:'13px 16px', textAlign:'right' }}>
                  {item.asset_class ? (
                    <span style={{ fontSize:11, fontFamily:'monospace',
                      color: assetColor[item.asset_class] || '#7a8ba8' }}>
                      {item.asset_class}
                    </span>
                  ) : '—'}
                </td>
                <td style={{ padding:'13px 16px', textAlign:'right',
                  fontFamily:'monospace', fontWeight:600 }}>
                  {fmt(item.current_value)}
                </td>
                <td style={{ padding:'13px 16px', textAlign:'right',
                  fontFamily:'monospace', color:'#7a8ba8' }}>
                  {item.current_value > 0 ? item.current_pct + '%' : '—'}
                </td>
                <td style={{ padding:'13px 16px', textAlign:'right' }}>
                  <span style={{ fontSize:11, fontFamily:'monospace',
                    color: item.is_model_fund ? '#22c97a' : '#f5a623' }}>
                    {item.is_model_fund ? '✓ Yes' : '⚠ No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{
          background:'#162038', borderTop:'1px solid #263552',
          padding:'13px 16px', display:'flex', justifyContent:'space-between', alignItems:'center'
        }}>
          <span style={{ fontSize:13, fontWeight:600 }}>Total Portfolio Value</span>
          <span style={{ fontFamily:'monospace', fontSize:16, fontWeight:700, color:'#4f8ef7' }}>
            {fmt(totalValue)}
          </span>
        </div>
      </div>
    </div>
  )
}