"use server";

import { currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

export const getUser = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser?.id) return null;

  return await getUserByClerkId(clerkUser.id);

};

export const getUserById = async (id: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`);

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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/clerk/${clerkId}`);

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

export const getClerkUser = async (userId: string) => {
  try {
    const user = await clerkClient.users.getUser(userId);
    console.log('user', user);
    return {
      id: user.id,
      username: user.username || user.firstName || "Onbekend",
      avatar: user.imageUrl,
    };
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
};