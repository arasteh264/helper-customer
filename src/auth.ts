import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { login } from "./features/auth/api/login";
import { ApiError } from "next/dist/server/api-utils";
import { ApiErrorCode } from "./lib/api/error";



export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Identifier", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const identifier = credentials?.identifier as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!identifier || !password) return null;

        try {
          const { user, accessToken } = await login({ identifier, password });

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            accessToken,
          };
        } catch (err) {
          const apiError = err instanceof ApiError ? err : null;
          if (apiError?.code === ApiErrorCode.INVALID_CREDENTIALS) {
            return null;
          }
          throw err;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.phone = token.phone as string;
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
});