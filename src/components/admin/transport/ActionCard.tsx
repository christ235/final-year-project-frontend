// components/transport/ActionCard.tsx
import Link from "next/link"

interface ActionCardProps {
  href: string
  title: string
  description: string
  gradient: string
  ariaLabel: string
}

export default function ActionCard({ href, title, description, gradient, ariaLabel }: ActionCardProps) {
  return (
    <Link href={href} aria-label={ariaLabel}>
      <div className={`text-white p-6 rounded-xl shadow hover:shadow-xl transition hover:-translate-y-1 ${gradient}`}>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-white/80">{description}</p>
      </div>
    </Link>
  )
}
