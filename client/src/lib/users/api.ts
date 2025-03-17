"use server";

import { currentUser } from "@clerk/nextjs/server";

export const getUser = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser?.id) return null;

  return await getUserByClerkId(clerkUser.id);

};

export const getUserById = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:8000/users/${id}`);

    if (response.ok) {
      const result = await response.json();

      return result.data?.data ?? null;
    } else {
      console.error("Failed to fetch user.");
    }
  } catch (error) {
    console.error("Failed to get user: ", error);
    return null;
  }
};

export const getUserByClerkId = async (clerkId: string) => {
  try {
    const response = await fetch(`http://localhost:8000/users/clerk/${clerkId}`);

    if (!response.ok) {
      console.error(`Failed to fetch user with ClerkId ${clerkId}. Status: ${response.status}`);
      return null;
    }

    const result = await response.json();
    return result.data?.data ?? null;
  } catch (error) {
    console.error("Error fetching user by ClerkId:", error);
    return null;
  }
}