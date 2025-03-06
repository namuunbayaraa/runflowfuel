import StravaProvider from "next-auth/providers/strava";
import { JWT } from "next-auth/jwt"
import { Account, Session } from "next-auth"

interface ExtendedJWT extends JWT {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  error?: string;
}

const STRAVA_AUTH_URL = "https://www.strava.com/oauth/authorize?" + new URLSearchParams({
  client_id: process.env.STRAVA_CLIENT_ID || '',
  redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/strava`,
  response_type: 'code',
  scope: 'read,activity:read_all',
  approval_prompt: 'auto'
}).toString();

async function refreshAccessToken(token: ExtendedJWT) {
  try {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken
      })
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token,
      expiresAt: Math.floor(Date.now() / 1000 + refreshedTokens.expires_in)
    };
  } catch (error) {
    console.error('Error refreshing access token', error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions = {
  providers: [
    StravaProvider({
      clientId: process.env.STRAVA_CLIENT_ID!,
      clientSecret: process.env.STRAVA_CLIENT_SECRET!,
      authorization: STRAVA_AUTH_URL,
    }),
  ],
  callbacks: {
    async jwt({ token, account }: { token: ExtendedJWT; account: Account | null }) {
      if (account) {
        // Initial sign in
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at,
        };
      }

      // Return previous token if the access token has not expired
      if (token.expiresAt && Date.now() < token.expiresAt * 1000) {
        return token;
      }

      // Access token expired, refresh it
      return refreshAccessToken(token);
    },
    async session({ session, token }: { session: Session; token: ExtendedJWT }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.expiresAt = token.expiresAt;
      return session;
    },
  },
}; 