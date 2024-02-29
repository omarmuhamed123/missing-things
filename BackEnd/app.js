import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { client } from "./models/data-model.js";
import LogIn from "./controllers/login.controller.js";
import { auth_middleware } from "./middlewares/auth.middleware.js";
import { comp_router } from "./routes/competition.route.js";
import itemRouter from "./routes/itemRoute.js";
import notificationRouter from "./routes/notificationRoute.js";
import complaintsRouter from "./routes/complaintsRouter.js";
import user_trip_Route from "./routes/userTrip.route.js";
import userRoute from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import discountsRouter from "./routes/discounts.route.js";
import competitorRouter from "./routes/competitor.route.js";
import centerRoute from "./routes/center.route.js";
import carRoute from "./routes/car.route.js";
const app = express();
dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 5500;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

async function start() {
  try {
    app.listen(PORT, () => console.log(`Hello, I'm Find Me server ${PORT}`));
  } catch (error) {
    console.log(error);
  }
}
start();
const connectDB = async () => {
  try {
    await client.connect();
    console.log("successful connection");
    // console.log((await client.query(`
    // update users set phone_number = 1111111111 where user_id = 1
    // `)));
    // console.log( await client.query(`call add_user('ahmed','rabie',0254,'pp@gmail.com','8988','Male',44,'cairo');`));
    // await client.end()   //end connection in the end of program

    // console.log((await client.query(`select pay(2,10);`)))
  } catch (error) {
    console.log(error);
  }
};
connectDB();

// app.post('/add_user/', AddUser);
app.use("/api/users", userRoute);
app.post("/api/login/", LogIn);
app.use(auth_middleware);
app.get("/api/home/", (req, res) => {
  return res.status(200).json({ status: "success", user_data: req.user });
});
//routes
app.use("/api/items", itemRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/complaints", complaintsRouter);
app.use("/api/competiton", comp_router);
app.use("/api/userTrip", user_trip_Route);
app.use("/api/products", productRouter);
app.use("/api/discounts", discountsRouter);
app.use("/api/competitors", competitorRouter);
app.use("/api/center", centerRoute);
app.use("/api/car", carRoute);
