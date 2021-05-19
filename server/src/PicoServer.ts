import path from 'path';
import Koa from 'koa';
import koaStatic from 'koa-static';
import koaMount from 'koa-mount';
import PicoRouter from './PicoRouter';
import glob from 'glob';
import koaBody from 'koa-body';
import Albums from './Album';
import errorHandler from './middleware/error-handler';
import timeout from './middleware/timeout';
import open from 'open';
import mime from 'mime';

// 提供picopath，扫描该目录路径下的所有文件，开启页面服务，映射文件至页面中进行展示、筛选
class PicoServer {
    // pico路径
    picoPath: string;
    // 端口
    port: number;
    fileList: Array<AlbumFile> = [];
    albums: Albums;
    constructor(picoPath: string, port: number) {
        this.picoPath = path.resolve(picoPath);
        console.log('Pico Path: ' + this.picoPath);
        this.port = port;
        this.albums = new Albums(picoPath);
    }

    private scanPicoFiles() {
        const fileArr = glob.sync(path.join(this.picoPath, './picos/**/*'), {
            nodir: true,
        });
        this.fileList = fileArr.map((filePath) => ({
            file: path.basename(filePath),
            filePath: path.relative(this.picoPath, filePath),
            mime: mime.lookup(path.extname(filePath)),
        }));
    }

    public async startServer() {
        this.scanPicoFiles();
        await this.albums.loadAlbum(this.picoPath);

        const app = new Koa();
        const picoRouter = new PicoRouter(
            this.fileList,
            this.albums
        ).getRouter();

        app
            .use(errorHandler())
            .use(timeout(2000))
            .use(koaBody())
            .use(koaMount('/', koaStatic(path.join(__dirname, '../dist'))))
            .use(koaMount('/pico', koaStatic(this.picoPath)))
            .use(picoRouter.routes())
            .use(picoRouter.allowedMethods())
            .listen(this.port, async () => {
                console.info(`> Ready on http://localhost:${this.port}`);
                console.info(`环境变量：${process.env.NODE_ENV || 'dev'}`);
                try {
                    await open('http://10.129.149.199:8997');
                } catch (e) {
                    console.log(e);
                }
            });
    }
}

(async () => {
    await new PicoServer('../pico/to', 8997).startServer();
})();
