"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeout = void 0;
function timeout(delay) {
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
            console.log('TimeoutMW');
            try {
                await next();
            }
            catch (e) {
                throw e;
            }
            finally {
                console.log('ClearTimeout');
                clearTimeout(timer);
            }
            console.log('TimeoutMWEnd');
        }
        await Promise.race([waiting(), nextMiddleware()]);
    };
}
exports.timeout = timeout;
//# sourceMappingURL=timeout.js.map