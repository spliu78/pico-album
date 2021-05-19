"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = void 0;
const nunjucks_1 = __importDefault(require("nunjucks"));
function render(viewPath, noCache) {
    const env = nunjucks_1.default.configure(viewPath, { noCache });
    return function (view) {
        this.type = 'html';
        this.body = env.render(`${view}.njk`, this.state);
    };
}
exports.render = render;
//# sourceMappingURL=context.js.map