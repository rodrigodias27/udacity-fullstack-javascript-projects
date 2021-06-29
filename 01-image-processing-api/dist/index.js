"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var index_1 = __importDefault(require("./routes/index"));
var app = express_1.default();
var port = 3000;
var errorMiddleware = function (err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500).send('Something broke!');
};
app.use('/api', index_1.default);
app.use(errorMiddleware);
app.listen(port, function () {
    console.log("server started at http://localhost:" + port);
});
