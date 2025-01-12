import express from "express";
import bodyParser from "body-parser";
import session from "express-session";

const app = express();
const port = 3000;

app.use(
    session({
        secret: "Ppl£$h3NXm9W!b,4!bjf1=q+>uYR3W)yFvq/TF^0X>6T0?",
        resave: false,
        saveUninitialized: true,
    })
);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/home", (req, res) => {
    if (!req.session.tasks) {
        req.session.tasks = []; // Initialize task list for the session
        req.session.taskId = 1; // Initialize task ID counter for the session
    }

    const hastask = req.session.tasks.length > 0;
    res.render("index.ejs", { hastask, tasks: req.session.tasks });
});

app.get("/", (req, res) => {
    if (!req.session.tasks) {
        req.session.tasks = []; // Initialize task list for the session
        req.session.taskId = 1; // Initialize task ID counter for the session
    }

    const hastask = req.session.tasks.length > 0;
    res.render("index.ejs", { hastask, tasks: req.session.tasks });
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});

app.post("/submit", (req, res) => {
    if (!req.session.tasks) {
        req.session.tasks = []; // Ensure task list exists
        req.session.taskId = 1; // Ensure task ID counter exists
    }

    const taskadd = req.body["task-name"];
    const descriptionadd = req.body["task-description"];
    const newTask = {
        id: req.session.taskId++, // Increment the session-specific task ID counter
        name: taskadd,
        description: descriptionadd,
    };

    req.session.tasks.unshift(newTask); // Add the task to the session-specific task list
    res.redirect("/home");
});

app.delete("/delete/:id", (req, res) => {
    if (!req.session.tasks) {
        req.session.tasks = [];
    }

    const taskId = parseInt(req.params.id); // Get task ID from URL
    req.session.tasks = req.session.tasks.filter(task => task.id !== taskId); // Remove the task

    // Check if tasks remain
    const hastask = req.session.tasks.length > 0;
    res.json({ success: true, hastask });
});

app.patch("/update/:id", (req, res) => {
    if (!req.session.tasks) {
        req.session.tasks = [];
    }

    const taskId = parseInt(req.params.id); // Get task ID from URL parameter
    const { name, description } = req.body; // Get the updated name and description from the request body

    // Find the task with the given ID
    const taskIndex = req.session.tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        // Update the task details
        req.session.tasks[taskIndex].name = name;
        req.session.tasks[taskIndex].description = description;
        res.json({ success: true, tasks: req.session.tasks });
    } else {
        res.status(404).json({ success: false, message: "Task not found" });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
