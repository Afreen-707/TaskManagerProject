import axios from "axios";
export const getTeam = async () => {
    let data;
    await axios
      .get("http://localhost:8800/get-team")
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
      return data;
  }

  export const updateUser = async (userData) => {
    try {
      const response = await axios.post("http://localhost:8800/updateProfile", userData);
      return response.data; // Return response from the API
    } catch (error) {
      console.error("Error updating user:", error);
      return { success: false, error };
    }
  };
  export const deleteUser = async (user) => {
    try {
      const response = await axios.delete("http://localhost:8800/deleteProfile", {
        data: user, // Pass the user object in the `data` field
      });
  
      console.log("Response:", response.data);
      return true; // Return true on success
    } catch (err) {
      console.error("Error deleting user:", err.response?.data || err.message);
      return false; // Return false on failure
    }
  };
  export const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8800/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  
  export const postTask = async() =>{
    try{
      const task = await axios.get("http://localhost:8800/addTask");
      setaddTask(task.data);
    }catch(error){
      console.log("Error fetching tasks:", error);
    }
  };
  // export const fetchCompletedTasks = async () => {
  //   let tasks = null; // Default value if the request fails
  //   console.log("Fetching completed tasks...");
    
  //   await axios
  //     .get("http://localhost:8800/completedTasks")
  //     .then((res) => {
  //       tasks = res.data.tasks; // Assign the tasks from the response
  //       console.log("Completed tasks fetched:", tasks);
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching completed tasks:", err);
  //     });
    
  //   return tasks;
  // };
  
  export const addTasks = async (data) => {
   console.log("inside addTask")
      await axios.post("http://localhost:8800/addTask", data).then((res)=>{
        console.log(res);
      }).catch((err) => {
       console.error("Error fetching add tasks:", err);
      });
   
  };
  export const addUsers = async (data) => {
    console.log("inside addUser")
       await axios.post("http://localhost:8800/addUser", data).then((res)=>{
         console.log(res);
       }).catch((err) => {
        console.error("Error fetching add users:", err);
       });
    
   };
    