"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const index = fs_1.default.readFileSync(path_1.default.join(__dirname, '../../dist/index.html'));
const errorHandler = () => {
    return async (ctx, next) => {
        try {
            await next();
            const status = ctx.status || 404;
            if (status === 404) {
                ctx.type = 'html';
                ctx.body = index;
                ctx.status = 200;
            }
        }
        catch (e) {
            ctx.status = 500;
            ctx.body = { msg: e.message, ret: -1 };
        }
    };
};
exports.default = errorHandler;
//# sourceMappingURL=error-handler.js.map