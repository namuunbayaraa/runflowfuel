import NextAuth from "next-auth";
import StravaProvider from "next-auth/providers/strava";

const STRAVA_AUTH_URL = "https://www.strava.com/oauth/authorize?" + new URLSearchParams({
  client_id: process.env.STRAVA_CLIENT_ID || '',
  redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/strava`,
  response_type: 'code',
  scope: 'read,activity:read_all',
  approval_prompt: 'auto'
}).toString();

const handler = NextAuth({
  providers: [
    StravaProvider({
      clientId: process.env.STRAVA_CLIENT_ID!,
      clientSecret: process.env.STRAVA_CLIENT_SECRET!,
      authorization: STRAVA_AUTH_URL,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token and refresh_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.expiresAt = token.expiresAt;
      return session;
    },
  },
});

export { handler as GET, handler as POST }; 