"use strict";
import { TestServer } from "./expressServer";
import express from "express";
import { TestController } from "./testController";


const app = express();
const port = process.env.PORT || 15000;

app.listen(port, () => {
    console.log(`server started on port ${port}`);
})

const server = new TestServer(app);