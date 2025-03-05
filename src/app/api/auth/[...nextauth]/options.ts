import StravaProvider from "next-auth/providers/strava";
import { JWT } from "next-auth/jwt"
import { Account, Session } from "next-auth"

interface ExtendedJWT extends JWT {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

const STRAVA_AUTH_URL = "https://www.strava.com/oauth/authorize?" + new URLSearchParams({
  client_id: process.env.STRAVA_CLIENT_ID || '',
  redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/strava`,
  response_type: 'code',
  scope: 'read,activity:read_all',
  approval_prompt: 'auto'
}).toString();

export const authOptions = {
  providers: [
    StravaProvider({
      clientId: process.env.STRAVA_CLIENT_ID!,
      clientSecret: process.env.STRAVA_CLIENT_SECRET!,
      authorization: STRAVA_AUTH_URL,
    }),
  ],
  callbacks: {
    async jwt({ token, account }: { token: JWT; account: Account | null }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: ExtendedJWT }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.expiresAt = token.expiresAt;
      return session;
    },
  },
}; 