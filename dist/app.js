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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const secretfunctions_1 = require("./secretfunctions");
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.static(__dirname));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get('/secret/:hash', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hash } = req.params;
    try {
        yield (0, secretfunctions_1.getSecretByHash)(req, res);
    }
    catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
app.get('/secret', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendFile(path_1.default.join(__dirname, 'index.html'));
}));
app.post('/secret', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uuid = (0, uuid_1.v4)(); //random UUID generálása a titkositashoz
        const { secret, expireAfter, expireAfterViews } = req.body;
        yield (0, secretfunctions_1.addSecret)(req, res, uuid);
        res.status(200).send({ msg: "Your secret has been added successfully", uuid: uuid });
    }
    catch (error) {
        res.status(500).send('There was an error while adding your secret!');
    }
}));
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
