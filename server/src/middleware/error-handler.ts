import { Middleware } from 'koa';
const errorHandler = (): Middleware => {
    return async (ctx, next) => {
        await next().catch((e: Error) => {
            ctx.body = { msg: e.message, ret: -1 };
        });
        if (!ctx.body) {
            ctx.body = { ret: 0 };
        }
    };
}
export default errorHandler;