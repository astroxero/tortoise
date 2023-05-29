import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://vnyvvhxfyerdjkzmrayi.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZueXZ2aHhmeWVyZGprem1yYXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE1NzMxMTMsImV4cCI6MTk5NzE0OTExM30.Qq3JOHl2WBdmcT1jzLjrVroc2pDrcLjcMfJB3tv6wY8");

function Account() {
  const session = supabase.auth.getSession();
  const [userEmail, setUserEmail] = useState('');

  //set user email
  useEffect(() => {
    makeEmail();
  }, [session]);

  function makeEmail() {
    if (session && session.user) {
        setUserEmail(session.user.email);
    } else {
        supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session && session.user) {
            setUserEmail(session.user.email);
        }
    });
}
}

  function signOut() {
    supabase.auth.signOut();
    window.location.href = '/login';
  }

  return (
    <>
      <div className="container">
        <h1>Logged in as {userEmail}</h1>
        <button onClick={signOut}>Sign Out</button>
      </div>
    </>
  );
}

export default Account;
