"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useSession, signIn } from 'next-auth/react'
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdCheckCircle, MdArrowRight } from 'react-icons/md'
import { FiGlobe } from 'react-icons/fi'

const AuthModal = ({ isOpen, setIsOpen }) => {
  const { register, handleSubmit, formState: { errors }, setError, clearErrors, trigger } = useForm({ mode: 'onChange' })
  const [login, setLogin] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showEmailSent, setShowEmailSent] = useState(false)
  const [emailSentTo, setEmailSentTo] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const modalRef = useRef(null)
  const inputRef = useRef(null)

  const position = isOpen ? ["opacity-100", "scale-100", "translate-y-0"] : ["opacity-0", "scale-95", "translate-y-4"]

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') setIsOpen(false)
  }, [setIsOpen])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleKeyDown])

  const switchMode = () => {
    setLogin(!login)
    clearErrors()
    setErrorMessage("")
    setSuccessMessage("")
    setShowEmailSent(false)
  }

  const resendEmail = async () => {
    if (!emailSentTo) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/auth/verify/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailSentTo })
      })
      if (res.ok) setSuccessMessage("Verification email resent!")
      else setErrorMessage("Failed to resend email")
    } catch {
      setErrorMessage("Something went wrong")
    }
    setIsSubmitting(false)
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setErrorMessage("")
    setSuccessMessage("")

    if (login) {
      const res = await signIn('credentials', { email: data.email, password: data.password, redirect: false })
      if (res?.error) {
        setErrorMessage("Invalid credentials. Please verify your account first.")
        setIsSubmitting(false)
        return
      }
      setSuccessMessage("Welcome back!")
      setTimeout(() => { setIsOpen(false); window.location.href = '/play' }, 800)
    } else {
      const valid = await trigger(['email', 'password'])
      if (!valid) { setIsSubmitting(false); return }

      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email, password: data.password })
        })
        const result = await response.json()
        if (!response.ok) {
          setErrorMessage(result.error || "Something went wrong")
          setIsSubmitting(false)
          return
        }
        if (result.user?.email && result.user?.token) {
          await fetch('/api/auth/verify/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: data.email, token: result.user.token })
          })
          setEmailSentTo(data.email)
          setShowEmailSent(true)
          setSuccessMessage("Verification email sent! Check your inbox.")
        } else {
          setErrorMessage("Account already exists. Please login.")
        }
      } catch {
        setErrorMessage("Connection failed. Please try again.")
      }
    }
    setIsSubmitting(false)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        className={`relative z-10 w-full max-w-md transform transition-all duration-300 ease-out ${position.join(" ")}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-slate-950/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-sky-500/10" />
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="relative p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-sky-500 mb-4">
                <FiGlobe className="w-8 h-8 text-white" />
              </div>
              <h1 id="auth-modal-title" className="text-2xl font-bold text-white">{login ? "Welcome back" : "Create account"}</h1>
              <p className="mt-2 text-slate-400">{login ? "Sign in to continue your language journey" : "Start guessing languages from around the world"}</p>
            </div>

            {errorMessage && (
              <div className="mb-6 flex items-center gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm animate-shake" role="alert">
                <MdCheckCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && !showEmailSent && (
              <div className="mb-6 flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm" role="status">
                <MdCheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {showEmailSent ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4">
                  <MdCheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Check your email</h3>
                <p className="text-slate-400 text-sm mb-6">We sent a verification link to <span className="text-white font-medium">{emailSentTo}</span></p>
                <button
                  onClick={resendEmail}
                  disabled={isSubmitting}
                  className="text-sm text-violet-400 hover:text-violet-300 font-medium flex items-center justify-center gap-1 mx-auto"
                >
                  {isSubmitting ? "Sending..." : "Resend email"}
                </button>
                <button
                  onClick={() => { setShowEmailSent(false); setLogin(true); }}
                  className="mt-4 text-sm text-slate-400 hover:text-slate-300"
                >
                  Back to login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <div className="relative">
                    <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      ref={inputRef}
                      {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" } })}
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/50 border border-white/10 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-white placeholder-slate-500 transition-all"
                      disabled={isSubmitting}
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                  </div>
                  {errors.email && (
                    <p id="email-error" className="mt-1.5 text-sm text-rose-400 flex items-center gap-1" role="alert">
                      <MdCheckCircle className="w-4 h-4" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                  <div className="relative">
                    <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      {...register("password", { required: "Password is required", minLength: { value: 8, message: "At least 8 characters" } })}
                      type={showPassword ? "text" : "password"}
                      autoComplete={login ? "current-password" : "new-password"}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-12 py-3 rounded-xl bg-slate-900/50 border border-white/10 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-white placeholder-slate-500 transition-all"
                      disabled={isSubmitting}
                      aria-invalid={errors.password ? "true" : "false"}
                      aria-describedby={errors.password ? "password-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <MdVisibilityOff className="w-5 h-5" /> : <MdVisibility className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p id="password-error" className="mt-1.5 text-sm text-rose-400 flex items-center gap-1" role="alert">
                      <MdCheckCircle className="w-4 h-4" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-sky-500 font-semibold text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-sky-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      {login ? "Signing in..." : "Creating account..."}
                    </>
                  ) : (
                    <>
                      {login ? "Sign in" : "Create account"}
                      <MdArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}

            <p className="mt-6 text-center text-sm text-slate-400">
              {login ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={switchMode}
                className="font-semibold text-violet-400 hover:text-violet-300 transition-colors"
              >
                {login ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthModal