"use client"
import Image from 'next/image'

const Logo = () => {
  return (
    <Image src="/languagle.png" alt="Langle" width={120} height={40} className="h-10 w-auto max-w-[11rem] object-contain" />
  )
}

export default Logo