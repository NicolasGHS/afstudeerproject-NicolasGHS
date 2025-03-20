"use client";

import { getUser } from "@/lib/users/api";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";


type User = {
    id: string;
    username: string;
    email: string;
}


const Profile = () => {
    const [userData, setUserData] = useState<User | null>(null);

    const { isSignedIn, user, isLoaded } = useUser(); 


    useEffect(() => {
        const fetchUser = async () => {
            const response: User = await getUser();
            
            setUserData(response);
        }

        fetchUser();
    }, []);


    if (!isLoaded) return <div>Loading...</div>;
    if (!isSignedIn) return <div>Sign in to view this page</div>;

    
    console.log("user", user);

    return (
        <>
            <h1 className="text-3xl">{user?.username}</h1>
        </>
    )
}

export default Profile;