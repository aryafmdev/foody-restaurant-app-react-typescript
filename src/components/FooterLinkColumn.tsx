import { Link } from '../ui/link'

type FooterLinkColumnProps = {
  title: string
  links: { label: string; href: string }[]
}

export default function FooterLinkColumn({ title, links }: FooterLinkColumnProps) {
  return (
    <div>
      <div className="text-md font-semibold mb-sm">{title}</div>
      <div className="space-y-xs">
        {links.map((l) => (
          <div key={l.href}>
            <Link href={l.href} variant="muted">{l.label}</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
