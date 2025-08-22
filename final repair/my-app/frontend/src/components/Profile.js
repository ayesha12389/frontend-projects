import React, { useEffect, useState } from "react";
import { getUserProfile } from "../api/auth";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getUserProfile();
        setUser(data.user);
      } catch (error) {
        console.error(error);
      }
    }
    fetchProfile();
  }, []);

  return (
    <div>
      <h2>User Profile</h2>
      {user ? <p>Welcome, {user.name} ({user.role})</p> : <p>Loading...</p>}
    </div>
  );
}

export default Profile;
