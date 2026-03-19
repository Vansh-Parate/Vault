import { Shield } from 'lucide-react'

export default function DigiLockerBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[999px] bg-[#E8EFF7] text-[#1B3A5C] text-[11px] font-sans font-medium">
      <Shield size={12} />
      DigiLocker · Government Verified
    </span>
  )
}

