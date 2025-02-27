declare namespace NodeJS {
  interface ProcessEnv {
    // Add your environment variables here
    NODE_ENV: 'development' | 'production' | 'test'
    NEXT_PUBLIC_API_URL: string
    // Add other env variables as needed
    STRAVA_ACCESS_TOKEN: string
    STRAVA_CLIENT_ID: string
    STRAVA_CLIENT_SECRET: string
    NEXTAUTH_URL: string
    NEXTAUTH_SECRET: string
  }
}
