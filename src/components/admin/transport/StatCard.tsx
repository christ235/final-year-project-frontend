// components/transport/StatCard.tsx
interface StatCardProps {
  label: string
  value: string | number
  color: 'blue' | 'green' | 'yellow' | 'purple'
}

export default function StatCard({ label, value, color }: StatCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow text-center">
      <h4 className={`text-${color}-600 text-sm font-medium`}>{label}</h4>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  )
}
