"use strict";

var express = require("express");

var CodeController = require("./codes.controller");

var codeRouter = express.Router();
codeRouter.post("/", CodeController.createCode); // codeRouter.get(
//     "/",
//     CodeController.getCode
// )
// codeRouter.delete(
//     "/",
//     CodeController.deleteCode
// )

module.exports = codeRouter;