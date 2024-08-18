import yargs, { Argv } from "yargs";
import fs from "fs";

interface Task {
  id: number;
  name: string;
  status: "todo" | "done" | "in-progress";
  createdAt: Date;
  updatedAt: Date;
}

const fileName = "tasks.json";

const argv = yargs
  .command("add <description>", "Add a new task", (yargs: Argv) => {
    yargs.positional("description", {
      type: "string",
      describe: "Task description",
    });
  })
  .command("update <id> <description>", "Update a task", (yargs: Argv) => {
    yargs.positional("id", {
      type: "number",
      describe: "Task ID",
    });
    yargs.positional("description", {
      type: "string",
      describe: "Task description",
    });
  })
  .command("delete <id>", "Delete a task", (yargs: Argv) => {
    yargs.positional("id", {
      type: "number",
      describe: "Task ID",
    });
  })
  .command(
    "mark-in-progress <id>",
    "Mark a task as in-progress",
    (yargs: Argv) => {
      yargs.positional("id", {
        type: "number",
        describe: "Task ID",
      });
    }
  )
  .command("mark-done <id>", "Mark a task as done", (yargs: Argv) => {
    yargs.positional("id", {
      type: "number",
      describe: "Task ID",
    });
  })
  .command("list", "List all tasks")
  .command("list [status]", "List all tasks by status", (yargs: Argv) => {
    yargs.positional("status", {
      type: "string",
      describe: "Task status",
      choices: ["todo", "done", "in-progress"],
    });
  })
  .help().argv as any;

const addTask = (description: string) => {
  try {
    if (!fs.existsSync(fileName)) {
      fs.writeFileSync(fileName, JSON.stringify([]));
    }
    const tasks = JSON.parse(fs.readFileSync(fileName).toString());
    const task: Task = {
      id: tasks.length + 1,
      name: description,
      status: "todo",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    tasks.push(task);
    fs.writeFileSync(fileName, JSON.stringify(tasks));
    return task;
  } catch (error) {
    throw new Error("Error adding task");
  }
};

const updateTask = (id: number, description: string) => {
  const tasks = JSON.parse(fs.readFileSync(fileName).toString());
  const task = tasks.find((task: Task) => task.id === id);
  if (!task) {
    throw new Error("Task not found");
  }
  task.name = description;
  task.updatedAt = new Date();
  fs.writeFileSync(fileName, JSON.stringify(tasks));
  return task;
};

const deleteTask = (id: number) => {
  try {
    const tasks = JSON.parse(fs.readFileSync(fileName).toString());
    const taskIndex = tasks.findIndex((task: Task) => task.id === id);
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }
    tasks.splice(taskIndex, 1);
    fs.writeFileSync(fileName, JSON.stringify(tasks));
    return tasks[taskIndex];
  } catch (error) {
    throw new Error("Task not found");
  }
};

const markInProgress = (id: number) => {
  try {
    const tasks = JSON.parse(fs.readFileSync(fileName).toString());
    const task = tasks.find((task: Task) => task.id === id);
    if (!task) {
      throw new Error("Task not found");
    }
    task.status = "in-progress";
    task.updatedAt = new Date();
    fs.writeFileSync(fileName, JSON.stringify(tasks));
    return task;
  } catch (error) {
    throw new Error("Task not found");
  }
};

const markDone = (id: number) => {
  try {
    const tasks = JSON.parse(fs.readFileSync(fileName).toString());
    const task = tasks.find((task: Task) => task.id === id);
    if (!task) {
      throw new Error("Task not found");
    }
    task.status = "done";
    task.updatedAt = new Date();
    fs.writeFileSync(fileName, JSON.stringify(tasks));
    return task;
  } catch (error) {
    throw new Error("Task not found");
  }
};

const listTasks = (status?: "done" | "in-progress" | "todo") => {
  try {
    const tasks = JSON.parse(fs.readFileSync(fileName).toString());
    if (status) {
      return tasks.filter((task: Task) => task.status === status);
    }
    return tasks;
  } catch (error) {
    throw new Error("No tasks found");
  }
};

switch (argv._[0]) {
  case "add":
    const addtask = addTask(argv.description as string);
    console.log(`Task added successfully (ID: ${addtask.id})`);
    break;
  case "update":
    const updatetask = updateTask(
      argv.id as number,
      argv.description as string
    );
    console.log(`Task updated successfully (ID: ${updatetask.id})`);
    break;
  case "delete":
    const deletedtask = deleteTask(argv.id as number);
    console.log(`Task deleted successfully (ID: ${deletedtask.id})`);
    break;
  case "mark-in-progress":
    const markInProgressTask = markInProgress(argv.id as number);
    console.log(
      `Task marked as in-progress successfully (ID: ${markInProgressTask.id})`
    );
    break;
  case "mark-done":
    const markDoneTask = markDone(argv.id as number);
    console.log(`Task marked as done successfully (ID: ${markDoneTask.id})`);
    break;
  case "list":
    const tasksList = listTasks(argv.status as "done" | "in-progress" | "todo");
    console.log(tasksList);
    break;
  default:
    console.log("Invalid command");
    break;
}
