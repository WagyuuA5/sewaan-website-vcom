import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export function AssistedPasswordConfirmation({ password, onChange }) {
  const [confirmPassword, setConfirmPassword] = useState('')
  const [shake, setShake] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleConfirmPasswordChange = (e) => {
    const val = e.target.value
    // If trying to type more than the actual password length when already full, shake
    if (
      confirmPassword.length >= password.length &&
      val.length > confirmPassword.length
    ) {
      setShake(true)
    } else {
      setConfirmPassword(val)
      if (onChange) onChange(val)
    }
  }

  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => setShake(false), 500)
      return () => clearTimeout(timer)
    }
  }, [shake])

  const getLetterStatus = (letter, index) => {
    if (!confirmPassword[index]) return ''
    return confirmPassword[index] === letter
      ? 'bg-emerald-500/20'
      : 'bg-rose-500/20'
  }

  const passwordsMatch = password && confirmPassword && password === confirmPassword

  const bounceAnimation = {
    x: shake ? [-10, 10, -10, 10, 0] : 0,
    transition: { duration: 0.5 },
  }

  const matchAnimation = {
    scale: passwordsMatch ? [1, 1.02, 1] : 1,
    transition: { duration: 0.3 },
  }

  const borderAnimation = {
    borderColor: passwordsMatch ? '#10B981' : '',
    transition: { duration: 0.3 },
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative flex w-full flex-col items-start justify-center">
        
        {/* Animated Dots Visualizer */}
        {password.length > 0 && (
            <motion.div
            className="mb-3 h-[42px] w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-2 py-1 flex items-center overflow-x-auto dark:bg-slate-800/40"
            animate={{
                ...bounceAnimation,
                ...matchAnimation,
                ...borderAnimation,
            }}
            >
            <div className="relative h-full w-fit rounded-lg flex items-center">
                <div className="z-10 flex h-full items-center justify-start bg-transparent px-2 gap-[11px]">
                {password.split('').map((_, index) => (
                    <div
                    key={index}
                    className="flex h-full w-[5px] shrink-0 items-center justify-center"
                    >
                    <span className="size-[5px] rounded-full bg-slate-400 dark:bg-slate-600"></span>
                    </div>
                ))}
                </div>
                <div className="absolute bottom-0 left-0 top-0 z-0 flex h-full w-full items-center justify-start px-2">
                {password.split('').map((letter, index) => (
                    <motion.div
                    key={index}
                    className={`ease absolute h-full w-[5px] rounded-full transition-all duration-300 ${getLetterStatus(
                        letter,
                        index,
                    )}`}
                    style={{
                        left: `${8 + (index * 16)}px`, // Match the gap of the dots above
                        scaleX: confirmPassword[index] ? 2.5 : 0,
                        scaleY: confirmPassword[index] ? 2.5 : 0,
                        transformOrigin: 'center',
                    }}
                    ></motion.div>
                ))}
                </div>
            </div>
            </motion.div>
        )}

        {/* Input Field */}
        <motion.div
          className="relative w-full"
          animate={matchAnimation}
        >
          <motion.input
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-slate-900 dark:text-slate-100 dark:bg-slate-800/40 dark:text-white"
            style={{ letterSpacing: showPassword ? 'normal' : '0.2em' }}
            type={showPassword ? "text" : "password"}
            placeholder="Konfirmasi password baru"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            animate={borderAnimation}
            disabled={password.length === 0}
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition dark:hover:text-slate-300"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </motion.div>
      </div>
    </div>
  )
}
