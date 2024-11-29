import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { errorHandler, routeNotFound } from "./middlewares/errorMiddlewaves.js";
import { protectRoute } from "./middlewares/authMiddlewave.js";
import { isAdminRoute } from "./middlewares/authMiddlewave.js";
import routes from "./routes/index.js";
import { dbConnection } from "./utils/index.js";
import Task from "./models/task.js";
import User from "./models/user.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

dbConnection();

const PORT = process.env.PORT || 5000;

const app = express();

// app.use(
//   cors({
//     origin: ["http://localhost:3000", "http://localhost:3001"],
//     methods: ["GET", "POST", "DELETE", "PUT"],
//     credentials: true,
//   })
// );
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // If using cookies/auth headers
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));
app.get("/", (req, res) => { res.send("Hell World") })

app.post("/addTask", async (req, res) => {

  console.log(req.body, "req")
  const task = new Task({
    title: req.body.title,
    priority: req.body.priority,
    stage: req.body.stage,
    assigned:[],
    subtask:[],
    isTrashed:false,
  });
  // Get all tasks


  // Save user
  const createdTask = await task.save();
  if (!createdTask) res.send(500, "Failed");
  res.send(200, createdTask);

});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find(); 
    res.status(200).json({
      success: true,
      tasks: tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});
app.get("/get-tasks", async (req, res) => {
  try {
    const tasks = await Task.find(); 
    res.status(200).json({last10Task: tasks.slice(-10)});
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});
app.post("/addUser", async (req, res) => {
  try {

    const user = new User({
      name: req.body.name,
      title: req.body.title,
      role: req.body.role,
      email: req.body.email,
      password: "$2a$10$SzmbjHtJsmkD8QHips9Sdu3peo/E2atwGJuPFZ9A1kriMMWeWeXDS",
      isAdmin: req.body.isAdmin,
      tasks: req.body.tasks,
      isActive: req.body.isActive,
    });

    await user.save();
    res.status(200).send(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("An error occurred");
  }
});


app.get('/get-team', async (req, res) => {
  try {

    const getTeam = await User.find();
    res.status(200).send(getTeam);
  } catch (error) {
    console.error('Error fetching team data:', error);
    res.status(500).send('Failed to fetch team data');
  }
});

app.post('/updateProfile', async (req, res) => {
  try {
    const { id, name, title, email, role } = req.body; 
    console.log("Inside API, email:", email);

    
    const result = await User.updateOne(
      { _id: id }, 
      {
        $set: {
          name: name,
          title: title,
          email: email,
          role: role,
        },
      }
    );

   
    if (result.matchedCount === 0) {
      return res.status(403).send({ error: "User not found" });
    }

    res.status(200).send({ message: "User updated successfully", result });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.post('/deleteProfile', async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).send({ error: "User ID is required" });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).send({ error: "User not found" });
    }

    res.status(200).send({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.get('/updateTask', async (req, res) => {
  try {
    const filter = { _id: req.body.id };
    const update = {
      "title": req.body.id,
      "priority": req.body.priority,
      "stage": req.body.id,
      "assets": [],
      "team": [],
      "isTrashed": false,
      "activities": [],
      "subTasks": []
    };
    const updateUser = await User.findOneAndUpdate({

    });
    if (!updateUser) res.send(500, "Failed");
    res.send(200, updateUser);
  } catch (error) {
    console.error('Error fetching team data:', error);
    res.status(500).send('Failed to fetch team data');
  }



});



app.get("/completedTasks",async (req,res)=>{
  try{
    const completedTasks = await Task.find({stage: "completed" });
    res.status(200).json({
      success: true,
      tasks: completedTasks,
    });
  }catch(error){
    console.error("Error fetching completed tasks:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching completed tasks",
    });
  }
});

app.get("/todoTasks",async (req,res)=>{
  try{
    const todoTasks = await Task.find({stage: "todo" });
    res.status(200).json({
      success: true,
      tasks: todoTasks,
    });
  }catch(error){
    console.error("Error fetching todo tasks:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching todo tasks",
    });
  }
});

app.get("/inProgressTasks",async (req,res)=>{
  try{
    const inProgressTasks = await Task.find({stage: "in progress" });
    res.status(200).json({
      success: true,
      tasks: inProgressTasks,
    });
  }catch(error){
    console.error("Error fetching in-progress tasks:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching in-progress tasks",
    });
  }
});

app.get("/lowTasks",async (req,res)=>{
  try{
    const lowTasks = await Task.countDocuments({priority: "low" });
    res.status(200).json({
      success: true,
      tasks: lowTasks,
    });
  }catch(error){
    console.error("Error fetching low tasks:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching low tasks",
    });
  }
});

app.get("/highTasks",async (req,res)=>{
  try{
    const highTasks = await Task.countDocuments({priority: "high" });
    res.status(200).json({
      success: true,
      tasks: highTasks,
    });
  }catch(error){
    console.error("Error fetching high tasks:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching high tasks",
    });
  }
});

app.get("/mediumTasks",async (req,res)=>{
  try{
    const mediumTasks = await Task.countDocuments({priority: "medium" });
    res.status(200).json({
      success: true,
      tasks: mediumTasks,
    });
  }catch(error){
    console.error("Error fetching medium tasks:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching medium tasks",
    });
  }
});

app.get("/normalTasks",async (req,res)=>{
  try{
    const normalTasks = await Task.find({priority: "normal" });
    res.status(200).json({
      success: true,
      tasks: normalTasks,
    });
  }catch(error){
    console.error("Error fetching normal tasks:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching normal tasks",
    });
  }
});

app.get("/notifications", async (req, res) => {
  try {
    const userId = req.query.userId; // User ID passed as query parameter
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const notifications = await Notification.find({ team: userId })
      .populate("task", "title") // Populate task details
      .sort({ createdAt: -1 }); // Sort by newest

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
});

// Mark a single notification as read
app.put("/notifications/read/:id", async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { $addToSet: { isRead: userId } }, // Add userId to isRead array
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ success: false, message: "Failed to mark as read" });
  }
});

// Mark all notifications as read for a specific user
app.put("/notifications/read-all", async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    await Notification.updateMany(
      { team: userId, isRead: { $ne: userId } }, // Only update unread notifications for the user
      { $addToSet: { isRead: userId } }
    );

    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ success: false, message: "Failed to mark all as read" });
  }
});

app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(middleware.route.path);
  }
});





//   // Save user
//   const createdUser = await user.save();
//   if (!createdUser) res.send(500, "Failed");
//   res.send(200, createdUser);

//  })





app.use(routeNotFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
