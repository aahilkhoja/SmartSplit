import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { GrowthPoint } from '../lib/growthSim'
import { MOCK_ANNUAL_GROWTH_RATE } from '../lib/growthSim'

export function GrowthChart({ points }: { points: GrowthPoint[] }) {
  return (
    <div>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="investFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#36f1c7" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#36f1c7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" />
            <XAxis dataKey="month" tickFormatter={(m) => `M${m}`} tick={{ fontSize: 11, fill: '#8a93a3' }} />
            <YAxis tickFormatter={(v) => `$${Math.round(v)}`} tick={{ fontSize: 11, fill: '#8a93a3' }} width={52} />
            <Tooltip
              contentStyle={{ background: '#0d141f', border: '1px solid #ffffff1a', borderRadius: 12 }}
              labelStyle={{ color: '#8a93a3' }}
              formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Simulated balance']}
              labelFormatter={(m) => `Month ${m}`}
            />
            <Area type="monotone" dataKey="balance" stroke="#36f1c7" strokeWidth={2} fill="url(#investFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-muted">
        Simulated projection at a fixed {(MOCK_ANNUAL_GROWTH_RATE * 100).toFixed(0)}% mock annual
        rate, assuming your current Invest contributions continue. Not a promise — real
        investments can lose value.
      </p>
    </div>
  )
}
