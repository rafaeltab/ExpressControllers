"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import express from "express";
var testController_1 = require("./testController");
// import { ExpressServer } from "../dist/src";
var controller = new testController_1.TestController();
var res = guarenteeProto(controller);
controller = new testController_1.TestController();
res = guarenteeProto(controller);
var e = 0;
function guarenteeProto(obj) {
    var proto = obj;
    if (obj.prototype === undefined) {
        proto = Object.getPrototypeOf(obj);
    }
    else {
        proto = obj.prototype;
    }
    return proto;
}
