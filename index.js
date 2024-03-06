const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');

const cwd = process.cwd();

const PORT = 3001;
const app = express();

const activity = cwd.includes('MongooseThoughtsApi')
    ? cwd.split('MongooseThoughtsApi')[1]
    : cwd;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something went wrong!');
//   });

db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`API server for ${activity} running on port ${PORT}!`);
    });
});