import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Invitado",
      credentials: {},
      async authorize(credentials) {
        // Modo Invitado: Simplemente devuelve un usuario demo
        return {
          id: "guest",
          name: "Invitado Demo",
          email: "guest@demo.com",
          role: "guest"
        };
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.role = session.user.email === 'maxireloco94@gmail.com' ? 'admin' : 'guest';
      }
      return session;
    }
  ,
  },
  pages: {
    signIn: '/login',
  }
});

export { handler as GET, handler as POST };
