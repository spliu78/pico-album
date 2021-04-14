"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
class PicoRouter {
    constructor(fileList) {
        this.router = new koa_router_1.default();
        this.fileList = fileList;
    }
    buildRouter() {
        this.router.get('/get_files', async (ctx) => {
            ctx.body = this.fileList;
        });
        this.router.get('/create_album', async (ctx) => {
        });
        this.router.get('/rename_album', async (ctx) => {
        });
        this.router.get('/remove_album', async (ctx) => {
        });
        this.router.get('/export_album', async (ctx) => {
        });
        this.router.get('/update_album', async (ctx) => {
        });
    }
    getRouter() {
        this.buildRouter();
        return this.router;
    }
}
exports.default = PicoRouter;
//# sourceMappingURL=PicoRouter.js.map