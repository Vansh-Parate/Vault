import Modal from '../ui/Modal'
import Button from '../ui/Button'

interface Props {
  isOpen: boolean
  onClose: () => void
  imported: Array<{ title: string; id: string }>
  onViewWallet: () => void
}

export default function ImportSuccessModal({ isOpen, onClose, imported, onViewWallet }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="DigiLocker">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-dark font-sans font-medium">Documents imported successfully!</p>
          <p className="text-sm text-dark-muted font-sans mt-1">
            {imported.length} credential{imported.length === 1 ? '' : 's'} added to your wallet:
          </p>
        </div>
        <div className="space-y-1.5">
          {imported.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-3 py-2 bg-cream-input rounded-[10px] border border-beige">
              <span className="text-sm text-dark font-sans">{c.title}</span>
              <span className="text-xs px-2 py-0.5 rounded-[999px] bg-sage-light text-sage font-sans font-medium">
                Verified
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={onClose}>
            Close
          </Button>
          <Button fullWidth onClick={onViewWallet}>
            View in Wallet
          </Button>
        </div>
      </div>
    </Modal>
  )
}

