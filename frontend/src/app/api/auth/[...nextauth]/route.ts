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
      name: "Acceso",
      credentials: {
        email: { label: "Email", type: "email" },
        isOwner: { label: "Owner", type: "text" }
      },
      async authorize(credentials) {
        if (credentials?.isOwner === "true" && credentials?.email === "maxireloco94@gmail.com") {
          return {
            id: "owner-99",
            name: "Maxi (Owner)",
            email: "maxireloco94@gmail.com",
            role: "admin"
          };
        }
        // Modo Invitado: Simplemente devuelve un usuario demo si no hay credenciales
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
  },
  pages: {
    signIn: '/login',
  }
});

export { handler as GET, handler as POST };
