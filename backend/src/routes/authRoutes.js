"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = require("../controllers/auth");
var router = express_1.default.Router();
router.post('/register', auth_1.createUser);
exports.default = router;
