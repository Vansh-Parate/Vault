import { useEffect, useMemo, useState } from 'react'
import { Building2, Shield, RefreshCcw, Unplug, ArrowRight } from 'lucide-react'
import api from '../../lib/api'
import Button from '../ui/Button'
import ConnectModal from './ConnectModal'
import ImportSuccessModal from './ImportSuccessModal'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'

type StatusResponse = {
  configured: boolean
  connected: boolean
  lastSynced: string | null
  importedCount: number
}

export default function ConnectCard() {
  const [status, setStatus] = useState<StatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [pollOpen, setPollOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [imported, setImported] = useState<Array<{ title: string; id: string }>>([])
  const navigate = useNavigate()

  const lastSyncedLabel = useMemo(() => {
    if (!status?.lastSynced) return null
    try {
      return format(new Date(status.lastSynced), 'MMM d, yyyy')
    } catch {
      return null
    }
  }, [status?.lastSynced])

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/digilocker/status')
      setStatus(res.data)
    } catch {
      setStatus({ configured: false, connected: false, lastSynced: null, importedCount: 0 })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const startConnect = async () => {
    const res = await api.post('/digilocker/session/init')
    const sid = res.data.session_id as string
    const url = res.data.authorization_url as string
    localStorage.setItem('digilocker_session_id', sid)
    setSessionId(sid)
    window.open(url, '_blank')
    setPollOpen(true)
  }

  const handleImported = (data: { imported: Array<{ title: string; id: string }> }) => {
    setImported(data.imported || [])
    setPollOpen(false)
    setSuccessOpen(true)
    load()
  }

  const disconnect = async () => {
    // No backend disconnect in spec; mimic disconnect by clearing local session id + refreshing status.
    localStorage.removeItem('digilocker_session_id')
    await load()
  }

  const configured = status?.configured ?? false
  const connected = status?.connected ?? false

  return (
    <>
      <div className="bg-cream-card border border-beige rounded-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#E8EFF7] flex items-center justify-center shrink-0">
              <Shield size={18} className="text-[#1B3A5C]" />
            </div>
            <div>
              <p className="font-display text-[16px] text-dark leading-snug">DigiLocker</p>
              <p className="text-sm text-dark-muted font-sans">
                Fetch your Aadhaar, PAN & Driving License directly from the government.
              </p>
              {!loading && !configured && (
                <p className="text-xs text-danger font-sans mt-2">
                  Not configured on server. Set `SANDBOX_API_KEY` / `SANDBOX_API_SECRET`.
                </p>
              )}
            </div>
          </div>
          <div className="w-10 h-10 rounded-[10px] bg-cream-input border border-beige flex items-center justify-center shrink-0">
            <Building2 size={18} className="text-dark-muted" />
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-beige flex items-center justify-between gap-3">
          <div className="min-w-0">
            {connected ? (
              <>
                <p className="text-sm font-sans text-dark font-medium">
                  ✓ Connected{lastSyncedLabel ? <span className="text-dark-muted font-normal"> · Last synced: {lastSyncedLabel}</span> : null}
                </p>
                <p className="text-xs text-dark-muted font-sans">
                  {status?.importedCount ?? 0} document{(status?.importedCount ?? 0) === 1 ? '' : 's'} imported
                </p>
              </>
            ) : (
              <p className="text-sm text-dark-muted font-sans">● Not connected</p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {connected ? (
              <>
                <Button size="sm" variant="ghost" onClick={startConnect} disabled={!configured}>
                  <RefreshCcw size={14} />
                  Re-sync
                </Button>
                <Button size="sm" variant="ghost" onClick={disconnect}>
                  <Unplug size={14} />
                  Disconnect
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={startConnect} disabled={!configured}>
                Connect Now <ArrowRight size={14} />
              </Button>
            )}
          </div>
        </div>
      </div>

      <ConnectModal
        isOpen={pollOpen}
        onClose={() => setPollOpen(false)}
        sessionId={sessionId}
        onImported={handleImported}
      />

      <ImportSuccessModal
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
        imported={imported}
        onViewWallet={() => {
          setSuccessOpen(false)
          navigate('/wallet')
        }}
      />
    </>
  )
}

