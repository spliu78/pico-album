"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const koa_1 = __importDefault(require("koa"));
const koa_static_1 = __importDefault(require("koa-static"));
const koa_mount_1 = __importDefault(require("koa-mount"));
const PicoRouter_1 = __importDefault(require("./PicoRouter"));
const glob_1 = __importDefault(require("glob"));
const koa_body_1 = __importDefault(require("koa-body"));
const Album_1 = __importDefault(require("./Album"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const timeout_1 = require("./middleware/timeout");
// 提供picopath，扫描该目录路径下的所有文件，开启页面服务，映射文件至页面中进行展示、筛选
class PicoAlbum {
    constructor(picoPath, port) {
        this.fileList = [];
        this.picoPath = path_1.default.resolve(picoPath);
        console.log('Pico Path: ' + this.picoPath);
        this.port = port;
        this.albums = new Album_1.default(picoPath);
    }
    scanPicoFiles() {
        const fileArr = glob_1.default.sync(path_1.default.join(this.picoPath, "./picos/**/*"), { nodir: true });
        this.fileList = fileArr.map(filePath => ({ file: path_1.default.basename(filePath), filePath }));
    }
    async startServer() {
        this.scanPicoFiles();
        await this.albums.loadAlbum(this.picoPath);
        const app = new koa_1.default();
        const picoRouter = new PicoRouter_1.default(this.fileList, this.albums).getRouter();
        app
            .use(error_handler_1.default())
            .use(timeout_1.timeout(2000))
            .use(koa_body_1.default())
            .use(koa_mount_1.default('/pico', koa_static_1.default(this.picoPath)))
            .use(koa_mount_1.default('/', koa_static_1.default(path_1.default.join(__dirname, '../dist'))))
            .use(picoRouter.routes())
            .use(picoRouter.allowedMethods())
            .listen(this.port, () => {
            console.info(`> Ready on http://localhost:${this.port}`);
            console.info(`环境变量：${process.env.NODE_ENV || 'dev'}`);
        });
    }
}
(async () => {
    await new PicoAlbum('../pico/to', 8997).startServer();
})();
//# sourceMappingURL=PicoAlbum.js.map