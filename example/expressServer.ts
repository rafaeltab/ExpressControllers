import { ExpressServer } from "../src";
import { Express } from "express";
import { TestController } from "./testController";

export class TestServer extends ExpressServer {
    constructor(app: Express) { 
        super(app);

        this.registerController(TestController)
    }
}