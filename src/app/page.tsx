"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const STRAVA_URL = `https://www.strava.com/oauth/authorize?client_id=CLIENT_ID&response_type=code&redirect_uri=http://localhost:3000/callback&scope=activity:read_all`;

export default function Home() {
  const [stravaAuth, setStravaAuth] = useState(false);

  const handleStravaLogin = async () => {
    window.location.href = STRAVA_URL;
    setStravaAuth(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Training & Recovery Dashboard</h1>
      <Button
        onClick={handleStravaLogin}
        className="mb-2"
        disabled={stravaAuth}
      >
        {stravaAuth ? "Connected to Strava" : "Connect Strava"}
      </Button>
    </div>
  );
}
