const express = require("express");
const app = express();
const userRouter = require("./routes/userRoutes");
const path = require("path");
// const usersStorage = require("./storage/usersStorage");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", userRouter);

const PORT = process.env.PORT || 3030;
// console.log(usersStorage);

app.listen(PORT, () => {
  console.log(`App is running on port: ${PORT}`);
});
