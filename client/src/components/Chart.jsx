import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import axios from "axios";

export const Chart = () => {
  const [medium, setmedium] = useState(0);
  const [high, sethigh] = useState(0);
  const [normal, setnormal] = useState(0);
  const [low, setlow] = useState(0);
  var chartData = [
    {
      name: "High",
      total: high,
    },
    {
      name: "Medium",
      total: medium,
    },
    {
      name: "Normal",
      total: normal,
    },
    {
      name: "Low",
      total: low,
    },
  ];
  useEffect(()=>{
    const fetchMedium = async () => {
      let tasks = null; // Default value if the request fails
      console.log("Fetching completed tasks...");
      
      await axios
        .get("http://localhost:8800/mediumTasks", {})
        .then((res) => {
          setmedium(res.data.tasks); // Assign the tasks from the response
          console.log("medium tasks fetched:", medium);
        })
        .catch((err) => {
          console.error("Error fetching completed tasks:", err);
        });
      
      return tasks;
    };
    const fetchHigh = async () => {
      let tasks = null; // Default value if the request fails
      console.log("Fetching completed tasks...");
      
      await axios
        .get("http://localhost:8800/highTasks", {})
        .then((res) => {
          sethigh(res.data.tasks); // Assign the tasks from the response
          console.log("Completed tasks fetched:", high);
        })
        .catch((err) => {
          console.error("Error fetching completed tasks:", err);
        });
      
      return tasks;
    };
    const fetchNormal = async () => {
      let tasks = null; // Default value if the request fails
      console.log("Fetching completed tasks...");
      
      await axios
        .get("http://localhost:8800/normalTasks", {})
        .then((res) => {
          setnormal(res.data.tasks.length); // Assign the tasks from the response
          console.log("Completed tasks fetched:", normal);
        })
        .catch((err) => {
          console.error("Error fetching completed tasks:", err);
        });
      
      return tasks;
    };
    const fetchLow = async () => {
      let tasks = null; // Default value if the request fails
      console.log("Fetching completed tasks...");
      
      await axios
        .get("http://localhost:8800/lowTasks", {})
        .then((res) => {
          setlow(res.data.tasks); // Assign the tasks from the response
          console.log("Completed tasks fetched:", low);
        })
        .catch((err) => {
          console.error("Error fetching completed tasks:", err);
        });
      
      return tasks;
    };
    fetchMedium();
    fetchHigh();
    fetchNormal();
    fetchLow();
  },[])
  
  return (
    <ResponsiveContainer width={"100%"} height={300}>
      <BarChart width={150} height={40} data={chartData}>
        <XAxis dataKey='name' />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid strokeDasharray='3 3' />
        <Bar dataKey='total' fill='#8884d8' />
      </BarChart>
    </ResponsiveContainer>
  );
};
