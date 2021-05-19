import { Middleware } from 'koa';
import fs from 'fs';
import path from 'path';

const index = fs.readFileSync(path.join(__dirname, '../../dist/index.html'));

const errorHandler = (): Middleware => {
    return async (ctx, next) => {
        try {
            await next();
            const status = ctx.status || 404;
            if (status === 404) {
                ctx.type = 'html';
                ctx.body = index;
                ctx.status = 200;
            }
        } catch (e) {
            ctx.status = 500;
            ctx.body = { msg: e.message, ret: -1 };
        }
    };
};
export default errorHandler;
