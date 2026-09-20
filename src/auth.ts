import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { login } from "./features/auth/api/login";
import { ApiError, ApiErrorCode } from "./lib/api/error";
import { decodeJwt } from "jose";
export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  trustHost: true,
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Identifier", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { accessToken } = await login({
            identifier: credentials?.identifier as string,
            password: credentials?.password as string,
          });

          const payload = decodeJwt(accessToken) as {
            userId: string;
            role: string;
          };

          return {
            id: payload.userId,
            role: payload.role,
            accessToken,
          };
        } catch (e) {
          if (e instanceof ApiError) {
            console.error("[authorize]", e.code, e.message);
          } else {
            console.error("[authorize]", e);
          }
          return null;
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


