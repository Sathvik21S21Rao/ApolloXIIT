const express = require('express');
const cors = require('cors')
const app = express();
const postRouter = require('./routes/post');
const bodyParser = require('body-parser');

require('dotenv').config({
   path: ".env.local"
})

// Middleware to parse JSON bodies
app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Custom router handling the /message endpoint
app.use('/message', postRouter);

// Start the server
const PORT = 8000;

app.get('/', (req, res) => {
   res.json({
      status: "alive"
   })
})

app.listen(PORT, () => {
   console.log(`Server is listening on port ${PORT}`);
});

module.exports = app