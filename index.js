import "dotenv/config";

import express from 'express';

const app = express();

app.get('/', (req, res) => {
    return res.send(`Received a GET HTTP method ${process.env.client_id}`);
});

app.listen(8088, () =>
  console.log(`Example app listening on port 8088!`),
);