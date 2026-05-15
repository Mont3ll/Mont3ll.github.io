interface MetaProps {
  label: string;
  value: string;
}

export function Meta({ label, value }: MetaProps) {
  return (
    <div>
      <dt className="mb-1 text-black/45">{label}</dt>
      <dd className="max-w-[340px] text-black/72">{value}</dd>
    </div>
  );
}
