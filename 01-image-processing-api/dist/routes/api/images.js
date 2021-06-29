"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resizeImage = exports.check_and_create_thumb = exports.images = void 0;
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var sharp_1 = __importDefault(require("sharp"));
var storeData_1 = require("../../utilities/storeData");
var jsonPath = path_1.default.resolve(__dirname, '../../../data/images.json');
var resizeImage = function (fileName, newFileName, width, height) { return __awaiter(void 0, void 0, void 0, function () {
    var widthNumber, heightNumber;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                widthNumber = 1 * width;
                heightNumber = 1 * height;
                console.info("Resizing " + fileName);
                return [4 /*yield*/, sharp_1.default(fileName)
                        .resize(widthNumber, heightNumber)
                        .toFile(newFileName)
                        .then(function (dataImage) {
                        console.info("Created " + newFileName);
                    })
                        .catch(function (err) {
                        console.error(err.message);
                        throw err;
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.resizeImage = resizeImage;
var check_and_create_thumb = function (image, width, height) { return __awaiter(void 0, void 0, void 0, function () {
    var thumbName, fileName, newFileName, data, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                thumbName = width + "x" + height;
                fileName = path_1.default.resolve(__dirname, '../../../images', image + ".jpg");
                newFileName = path_1.default.resolve(__dirname, '../../../thumb/', image + "-" + thumbName + ".jpg");
                return [4 /*yield*/, storeData_1.getData(jsonPath)];
            case 1:
                data = _a.sent();
                // Logs
                console.log(thumbName);
                console.log(fileName);
                console.log(newFileName);
                console.log(data);
                // Create an object
                if (data[image] === undefined) {
                    data[image] = {};
                }
                ;
                if (!(data[image][thumbName] === undefined)) return [3 /*break*/, 3];
                return [4 /*yield*/, resizeImage(fileName, newFileName, width, height)];
            case 2:
                _a.sent();
                data[image][thumbName] = newFileName;
                _a.label = 3;
            case 3:
                ;
                // Logs
                console.log(data);
                // Save json
                return [4 /*yield*/, storeData_1.appendData(data, jsonPath)];
            case 4:
                // Save json
                _a.sent();
                return [2 /*return*/, data[image][thumbName]];
            case 5:
                error_1 = _a.sent();
                console.error(error_1.message);
                throw error_1;
            case 6:
                ;
                return [2 /*return*/];
        }
    });
}); };
exports.check_and_create_thumb = check_and_create_thumb;
var images = express_1.default.Router();
exports.images = images;
images.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var image, width, height, responseFileName, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                image = req.query.image;
                width = req.query.width;
                height = req.query.height;
                return [4 /*yield*/, check_and_create_thumb(image, width, height)];
            case 1:
                responseFileName = _a.sent();
                res.sendFile(responseFileName);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error(error_2.message);
                res.status(500).send("Internal Error");
                return [3 /*break*/, 3];
            case 3:
                ;
                return [2 /*return*/];
        }
    });
}); });
