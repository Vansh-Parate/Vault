import React from 'react'
import { motion } from 'framer-motion'

const pageTransition = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.15, ease: 'easeOut' },
}

const ShareView: React.FC = () => {
  return (
    <motion.div className="view-content" {...pageTransition}>
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--dark-muted)' }}>
        Share functionality is available in the Credential Detail view.
      </div>
    </motion.div>
  )
}

export default ShareView
