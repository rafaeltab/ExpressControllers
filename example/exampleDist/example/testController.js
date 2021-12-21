"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
var src_1 = require("../dist/src");
var TestController = /** @class */ (function () {
    function TestController() {
    }
    TestController.prototype.get = function (index, cool) {
        console.log(index + " " + cool);
    };
    __decorate([
        src_1.Methods.delete({
            path: "/test",
            description: "cool yeah"
        }),
        __param(0, (0, src_1.requestParameter)({
            name: "index",
            required: true,
            type: "integer"
        })),
        __param(1, (0, src_1.requestParameter)({
            name: "cool",
            required: true,
            type: "boolean"
        })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Boolean]),
        __metadata("design:returntype", void 0)
    ], TestController.prototype, "get", null);
    TestController = __decorate([
        (0, src_1.Controller)({
            path: "/test",
            tags: ["Test"]
        })
    ], TestController);
    return TestController;
}());
exports.TestController = TestController;
