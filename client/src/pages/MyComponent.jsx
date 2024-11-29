import { useEffect, useState } from "react";
import axios from "axios";

import { getTeam } from "../utils/api";
function MyComponent() {
  const [fetchedUsers, setFetchedUsers] = useState([]); // Initialize as empty array

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching users...");
        const allUsers = await getTeam();
        console.log("Fetched users:", allUsers);
        setFetchedUsers(allUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  if (!fetchedUsers || fetchedUsers.length === 0) {
    return <div>Loading or no users available...</div>;
  }

  return (
    <div>
      {fetchedUsers.map(user => (
        <p key={user.id}>{user.name}</p>
      ))}
    </div>
  );
}

export default MyComponent;
