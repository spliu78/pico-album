"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timeout = function (delay) {
    return async (ctx, next) => {
        if (delay <= 0) {
            return next();
        }
        let timer;
        function waiting() {
            return new Promise((resolve, reject) => {
                timer = setTimeout(() => {
                    ctx.body = '请求超时，请稍后再试';
                    resolve('timeout');
                }, delay);
            });
        }
        async function nextMiddleware() {
            try {
                await next();
            }
            catch (e) {
                throw e;
            }
            finally {
                clearTimeout(timer);
            }
        }
        await Promise.race([waiting(), nextMiddleware()]);
    };
};
exports.default = timeout;
//# sourceMappingURL=timeout.js.map