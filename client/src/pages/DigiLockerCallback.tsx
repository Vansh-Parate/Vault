import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import TopBar from '../components/layout/TopBar'
import Button from '../components/ui/Button'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

export default function DigiLockerCallback() {
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    setSessionId(localStorage.getItem('digilocker_session_id'))
  }, [])

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25 }}
    >
      <TopBar title="DigiLocker" />
      <div className="max-w-xl bg-cream-card border border-beige rounded-[14px] p-6">
        <p className="text-sm text-dark font-sans font-medium">Authorization complete.</p>
        <p className="text-sm text-dark-muted font-sans mt-1">
          You can close this tab and return to the Vault dashboard to finish importing your documents.
        </p>
        {sessionId && (
          <p className="text-xs text-dark-muted font-mono mt-4">
            Session: {sessionId}
          </p>
        )}
        <div className="mt-5">
          <Button onClick={() => window.close()} variant="ghost">
            Close tab
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

