// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const cors = require('cors')
// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
const musclegroupsRoutes = require('./routes/musclegroups.routes')
const workoutsRoutes = require('./routes/workouts.routes')
const exercisesRoutes = require('./routes/exercises.routes')

app.use("/api", indexRoutes);
app.use('/auth', require('./routes/auth.routes'))

app.use('/exercises', exercisesRoutes)
app.use('/workouts', workoutsRoutes)
app.use('/musclegroups', musclegroupsRoutes)

app.get('/', (req, res) => {
    res.send('Server is up and running!')
})
// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
