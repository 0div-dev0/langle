"use client"
import React, {useState} from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AuthModal from './AuthModal'
import AccOptions from './AccOptions'

const AccBtns = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    // if (status=="loading"){
    //     return <></>
    // } //Apply to every page that renders conditionally

    return (

            <div className="right ">
                {session ? <div className="flex text-white gap-3 items-center justify-center">
                    {/* Signed  */}
                     {session.user.email}
                     <AccOptions/>
                </div> : <div className="flex gap-3 items-center justify-center">
                    {/* Not signed in */}
                    <button className="px-3 py-1 bg-mauve-700-400 text-white rounded-lg hover:scale-110 outline-2 outline-gray-400 hover:outline-white cursor-pointer font-bold hover:brightness-200" onClick={() => { setIsOpen(true)
                         console.log(isOpen)}}>Sign up</button>
                         <div className="absolute top-0 left-0">

       <AuthModal isOpen={isOpen} setIsOpen={setIsOpen}/>
                         </div>
                </div>}
            </div>
    )
    //   if(session) {
    //     return <div>
    //       Signed in as {session.user.email} <br/>
    //       <button onClick={() => signOut()}>Sign out</button>
    //     </div>
    //   }
    //   return <div>
    //     Not signed in <br/>
    //     <button onClick={() => signIn()}>Sign in</button>
    //     <button onClick={()=>{router.push("/signup")}}>Sign up</button>
    //   </div>
}

export default AccBtns
