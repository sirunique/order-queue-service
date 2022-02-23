const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const amqp = require("amqplib");
const { OrderModel } = require("./application/model/Order");

// Load Env
require("dotenv").config();

// Connect Database
require("./application/db")();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

let channel, connection;

const connect = async () => {
  const amqpServer = process.env.AMQP_URL;
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();

  await channel.assertQueue("ORDER");
};

connect().then(() => {
  console.log("Waiting for data .....");

  channel.consume("ORDER", (data) => {
    console.log("Consuming ORDER service");

    console.log(JSON.parse(data.content));
    let orderdata = JSON.parse(data.content);

    // consume order
    consumeOrder(orderdata);

    // acknowledge queue
    channel.ack(data);

    console.log("Order Consume and Acknowledge Successfully");
  });
});

const consumeOrder = async (order) => {
  try {
    let obj = {};
    for (const key in order) {
      obj[key] = order[key];
    }

    obj["_id"] = new mongoose.Types.ObjectId();

    await new OrderModel(obj).save();
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const port = process.env.PORT || 5056;
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Product Server Listen on ${port}`);
});
