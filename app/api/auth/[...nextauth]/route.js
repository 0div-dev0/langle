import NextAuth from 'next-auth'
import GithubProvider from "next-auth/providers/github"
import connectMongo from '@/lib/dbConfig'
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs'
import User from '@/app/models/userModel'
export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectMongo()
        const user = await User.findOne({ email: credentials.email })
        if (!user.isVerified){
          throw new Error('Verify Email first')
        }
        if (user && user.password) {
          const isValid = await bcrypt.compare(credentials.password, user.password)
          if (isValid) {
            return { id: user._id, email: user.email, name: user.name }
          } else {
            throw new Error('Invalid credentials')
          }
        } else {
          throw new Error('No user found')
        }
      },
    }),
  ],
//   pages: {
//   signIn: '/login', // custom login page at /login
//   signOut: '/logout',
//   error: '/auth/error', // optional
// },
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }