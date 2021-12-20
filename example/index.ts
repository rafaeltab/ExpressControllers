"use strict";
import express from "express";
import { TestController } from "./testController";
import { ExpressServer } from "../dist/src";

const app = express();
const port = process.env.PORT || 15000;

app.get("*", (req, res) => {
    res.send("Oi")
})

app.listen(port, () => {
    console.log(`server started on port ${port}`);
})

const controller = TestController;

ExpressServer.registerController(controller);