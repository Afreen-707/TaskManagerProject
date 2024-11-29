import React, { useState, useEffect } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import BoardView from "../components/BoardView";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import axios from "axios"; // Import axios for API calls

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const Tasks = () => {
  const params = useParams();
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchedTasks, setFetchedTasks] = useState([]);
  const [error, setError] = useState(null);

  const status = params?.status || "";

  // Fetch tasks when the component mounts or `status` changes
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null); // Reset the error state
      console.log(status, "status")
      try {
        const url = 
        status === "completed"
          ? "http://localhost:8800/completedTasks"
          : status === "in progress"
          ? "http://localhost:8800/inProgressTasks"
          : status === "todo"
          ? "http://localhost:8800/todoTasks"
          : "http://localhost:8800/tasks";
console.log(url,"url")
        const response = await axios.get(url); // Make the API request
        if (response)
          setFetchedTasks(response.data.tasks); // Update state with fetched tasks
         else {
          throw new Error("Failed to fetch tasks.");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to load tasks.");
      } finally {
        setLoading(false); // Set loading to false when the request is complete
      }
    };

    fetchTasks();
  }, [status]); // Fetch tasks whenever `status` changes

  // If tasks are still loading, show the loader
  if (loading) {
    return (
      <div className="py-10">
        <Loading />
      </div>
    );
  }

  // If there is an error fetching tasks, display an error message
  if (error) {
    return <div className="py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        {!status && (
          <Button
            onClick={() => setOpen(true)}
            label="Create Task"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
          />
        )}
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {!status && (
          <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
            <TaskTitle label="To Do" className={TASK_TYPE.todo} />
            <TaskTitle label="In Progress" className={TASK_TYPE["in progress"]} />
            <TaskTitle label="Completed" className={TASK_TYPE.completed} />
          </div>
        )}

        {selected !== 1 ? (
          <BoardView tasks={fetchedTasks} /> // Pass the fetched tasks to BoardView
        ) : (
          <div className="w-full">
            <Table tasks={fetchedTasks} /> // Pass the fetched tasks to Table
          </div>
        )}
      </Tabs>

      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;
