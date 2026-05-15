interface ContactLineProps {
  label: string;
  value: string;
  href: string;
}

export function ContactLine({ label, value, href }: ContactLineProps) {
  return (
    <div>
      <p className="mb-1 text-[13px] text-black/45">{label}</p>
      <a className="text-link" href={href}>
        {value} <span>→</span>
      </a>
    </div>
  );
}
