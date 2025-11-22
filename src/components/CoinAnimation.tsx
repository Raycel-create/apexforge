import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export function CoinAnimation() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed bottom-6 right-6 z-40 pointer-events-none"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 0.5, repeat: 3 }}
              className="text-5xl"
            >
              🏦
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ x: -100, y: 0, scale: 1, opacity: 1 }}
            animate={{
              x: [0, 150, 300, 450],
              y: [0, -80, -50, 10],
              scale: [1, 0.9, 0.7, 0.3],
              opacity: [1, 1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.8,
              ease: 'easeInOut',
            }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <motion.div
              animate={{ rotateY: [0, 360, 720, 1080] }}
              transition={{ duration: 1.8, ease: 'linear' }}
              className="text-3xl sm:text-4xl"
            >
              🪙
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
