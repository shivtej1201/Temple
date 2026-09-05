import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "dev" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Mock authorization for development. 
        // In prod, use Prisma adapter + proper password hashing.
        if (credentials?.username === "admin" && credentials?.password === "admin") {
          return { id: "1", name: "Admin User", email: "admin@darshan.com", role: "ADMIN" }
        }
        if (credentials?.username === "user" && credentials?.password === "user") {
          return { id: "2", name: "Regular User", email: "user@darshan.com", role: "USER" }
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  }
})
