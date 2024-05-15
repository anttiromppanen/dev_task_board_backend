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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("../helpers/logger"));
dotenv_1.default.config();
const DB_URL = process.env.DB_URL || "";
const clientOptions = {
    serverApi: { version: "1", strict: true, deprecationErrors: true },
};
function connectDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
            yield mongoose_1.default.connect(DB_URL, Object.assign(Object.assign({}, clientOptions), { serverApi: "1" }));
            yield mongoose_1.default.connection.db.admin().command({ ping: 1 });
            logger_1.default.info("Pinged your deployment. You successfully connected to MongoDB!");
        }
        catch (_a) {
            // Ensures that the client will close when you finish/error
            yield mongoose_1.default.disconnect();
        }
    });
}
exports.default = connectDb;
