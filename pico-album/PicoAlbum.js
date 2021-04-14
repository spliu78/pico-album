"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const koa_1 = __importDefault(require("koa"));
const koa_static_1 = __importDefault(require("koa-static"));
const koa_mount_1 = __importDefault(require("koa-mount"));
const PicoRouter_1 = __importDefault(require("./PicoRouter"));
const glob_1 = __importDefault(require("glob"));
const util_1 = require("./util");
// 提供picopath，扫描该目录路径下的所有文件，开启页面服务，映射文件至页面中进行展示、筛选
class PicoAlbum {
    constructor(picoPath, port) {
        this.fileList = [];
        this.albums = [];
        this.picoPath = path_1.default.resolve(picoPath);
        this.port = port;
    }
    scanPicoFiles() {
        const fileArr = glob_1.default.sync(path_1.default.join(this.picoPath, "*"));
        console.log(fileArr);
    }
    async loadAlbum() {
        const albumFile = path_1.default.join(this.picoPath, './pico/AlbumInfo.data');
        if (await util_1.fileExist(albumFile)) {
            this.albums = JSON.parse(await promises_1.default.readFile(albumFile, 'utf-8'));
        }
    }
    async startServer() {
        this.scanPicoFiles();
        await this.loadAlbum();
        const app = new koa_1.default();
        const picoRouter = new PicoRouter_1.default(this.fileList).getRouter();
        app.use(koa_mount_1.default('/pico', koa_static_1.default(this.picoPath)))
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
    await new PicoAlbum(path_1.default.join(__dirname, '../pico-album'), 8997).startServer();
})();
//# sourceMappingURL=PicoAlbum.js.map