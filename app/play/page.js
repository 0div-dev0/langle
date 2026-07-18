"use client"

import React from 'react'
import Navbar from '../component/Navbar'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DailyGame from '../component/DailyGame'

const PlayPage = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center game-bg">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
      </div>
    )
  }
  if (!session) {
    router.push('/')
    return null
  }
  return (
    <div className="min-h-screen game-bg">
      <Navbar />
      <main className="container-custom py-8">
        <DailyGame />
      </main>
    </div>
  )
}

export default PlayPage