import nunjucks from 'nunjucks';
import { Context } from 'koa';

export function render(
    viewPath: string,
    noCache: boolean
): (this: Context, view: string) => void {
    const env = nunjucks.configure(viewPath, { noCache });
    return function (this, view) {
        this.type = 'html';
        this.body = env.render(`${view}.njk`, this.state);
    };
}
