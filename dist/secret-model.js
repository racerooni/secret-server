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
exports.decrementViews = exports.saveSecret = exports.findSecret = void 0;
const db_1 = __importDefault(require("./db"));
const findSecret = (hash) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield db_1.default.execute('SELECT * FROM secrets WHERE id = ?', [hash]);
    if (!rows || !rows.length) {
        return null;
    }
    console.log(rows);
    return {
        id: rows[0].id,
        secret: rows[0].secret,
        expireAfter: rows[0].expireAfter,
        expireAfterViews: rows[0].expireAfterViews,
    };
});
exports.findSecret = findSecret;
const saveSecret = (id, secretText, expireAfterViews, expireAfterMinutes) => __awaiter(void 0, void 0, void 0, function* () {
    const expireAfter = expireAfterMinutes > 0 ? new Date(Date.now() + expireAfterMinutes * 60000) : null;
    const query = 'INSERT INTO secrets (id, secret, expireAfter, expireAfterViews) VALUES (?, ?, ?, ?)';
    yield db_1.default.execute(query, [id, secretText, expireAfter, expireAfterViews]);
});
exports.saveSecret = saveSecret;
const decrementViews = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'UPDATE secrets SET expireAfterViews = expireAfterViews - 1 WHERE id = ?';
    yield db_1.default.execute(query, [id]);
});
exports.decrementViews = decrementViews;
