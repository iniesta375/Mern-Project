const express = require("express");
const cors = require("cors");
const router = require("./routes/api");
const { connectDB } = require("./connection");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", router);
connectDB();

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Lift off! Server is running on port ${port}`);
});