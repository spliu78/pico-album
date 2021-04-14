import path from 'path';
import fsPromises from 'fs/promises';
import fs from 'fs';
import Koa from 'koa';
import koaStatic from 'koa-static';
import koaMount from 'koa-mount';
import PicoRouter from './PicoRouter';
import glob from 'glob';

import { fileExist } from './util';
// 提供picopath，扫描该目录路径下的所有文件，开启页面服务，映射文件至页面中进行展示、筛选
class PicoAlbum {
    // pico路径
    picoPath: string;
    // 端口
    port: number;
    fileList: Array<AlbumFile> = [];
    albums: Array<AlbumData> = [];
    constructor(picoPath: string, port: number) {
        this.picoPath = path.resolve(picoPath);
        this.port = port;
    }

    private scanPicoFiles() {
        const fileArr = glob.sync(path.join(this.picoPath, "*"));
        this.fileList = fileArr.map(filePath => ({ file: path.basename(filePath), filePath }));
    }

    private async loadAlbum() {
        const albumFile = path.join(this.picoPath, './pico/AlbumInfo.data');
        if (await fileExist(albumFile)) {
            this.albums = JSON.parse(await fsPromises.readFile(albumFile, 'utf-8'));
        }
    }

    public async startServer() {
        this.scanPicoFiles();
        await this.loadAlbum();

        const app = new Koa();
        const picoRouter = new PicoRouter(this.fileList).getRouter();

        app.use(koaMount('/pico', koaStatic(this.picoPath)))
            .use(koaMount('/', koaStatic(path.join(__dirname, '../dist'))))
            .use(picoRouter.routes())
            .use(picoRouter.allowedMethods())
            .listen(this.port, () => {
                console.info(`> Ready on http://localhost:${this.port}`);
                console.info(`环境变量：${process.env.NODE_ENV || 'dev'}`);
            });
    }
}

(async () => {
    await new PicoAlbum(path.join(__dirname, '../pico-album'), 8997).startServer();
})();

