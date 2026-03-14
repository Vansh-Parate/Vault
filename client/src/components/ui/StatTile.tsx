interface StatTileProps {
  value: number;
  label: string;
}

export default function StatTile({ value, label }: StatTileProps) {
  return (
    <div className="bg-cream-card border border-beige rounded-[14px] p-6">
      <p className="font-display text-[32px] text-dark leading-tight">{value}</p>
      <p className="text-[13px] text-dark-muted font-sans mt-1">{label}</p>
    </div>
  );
}
