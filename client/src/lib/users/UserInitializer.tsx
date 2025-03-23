"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function UserInitializer() {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {

      const email = user.emailAddresses?.[0]?.emailAddress;
      const username = user.username

      if (email) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Email: email,
            Username: username,
            ClerkId: user.id,
          }),
        })
          .then((res) => res.json())
          .catch((err) => console.error("Error creating user:", err));
      } else {
        console.error("No email found");
      }
    }
  }, [isSignedIn, user]);

  return null; 
}