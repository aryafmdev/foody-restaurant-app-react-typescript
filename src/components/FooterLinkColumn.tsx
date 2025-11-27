import { Link } from '../ui/link';

type FooterLinkColumnProps = {
  title: string;
  links: { label: string; href: string }[];
};

export default function FooterLinkColumn({
  title,
  links,
}: FooterLinkColumnProps) {
  return (
    <div>
      <div className='text-lg font-extrabold mb-2xl'>{title}</div>
      <div className='space-y-2xl'>
        {links.map((l) => (
          <div key={l.href}>
            <Link
              href={l.href}
              variant='muted'
              className='text-white hover:opacity-90'
            >
              {l.label}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
