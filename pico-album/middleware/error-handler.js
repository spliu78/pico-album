"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = () => {
    return async (ctx, next) => {
        await next().catch((e) => {
            ctx.body = { msg: e.message, ret: -1 };
        });
        if (!ctx.body) {
            ctx.body = { ret: 0 };
        }
    };
};
exports.default = errorHandler;
//# sourceMappingURL=error-handler.js.map