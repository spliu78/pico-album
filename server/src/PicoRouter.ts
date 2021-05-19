import Router from 'koa-router';
import { DefaultState, Context, Middleware } from 'koa';
import Albums from './Album';
import path from 'path';
import open from 'open';

export default class PicoRouter {
    fileList: Array<AlbumFile>;
    albums: Albums;
    router = new Router<DefaultState, Context>();

    constructor(fileList: Array<AlbumFile>, albumList: Albums) {
        this.fileList = fileList;
        this.albums = albumList;
    }

    private buildRouter() {
        this.router.get('/get_files', async (ctx) => {
            ctx.body = this.fileList;
        });

        // create_album?name=
        this.router.get('/create_album', async (ctx) => {
            const name = ctx.URL.searchParams.get('name');
            console.log(name);
            if (!name) throw new Error('Album name illegal!');
            this.albums.createAlbum(name);
            await this.albums.saveAlbumToDisk();
        });

        this.router.get('/rename_album', async (ctx) => {
            const name = ctx.URL.searchParams.get('name');
            const newName = ctx.URL.searchParams.get('new_name');
            if (!name || !newName) throw new Error('Album name illegal!');
            this.albums.renameAlbum(name, newName);
            await this.albums.saveAlbumToDisk();
        });

        this.router.get('/remove_album', async (ctx) => {
            const name = ctx.URL.searchParams.get('name');
            if (!name) throw new Error('Album name illegal!');
            this.albums.removeAlbum(name);
            await this.albums.saveAlbumToDisk();
        });

        this.router.get('/get_all_album', async (ctx) => {
            ctx.body = this.albums.getAlbums();
        });

        this.router.get('/get_album', async (ctx) => {
            const name = ctx.URL.searchParams.get('name');
            if (!name) throw new Error('Album name illegal!');
            ctx.body = this.albums.getAlbum(name);
        });

        this.router.get('/export_album', async (ctx) => {
            const name = ctx.URL.searchParams.get('name');
            if (!name) throw new Error('Album name illegal!');
            this.albums.exportAlbum(name);
        });

        this.router.all('/update_album', async (ctx) => {
            const name = ctx.URL.searchParams.get('name');
            // console.log(name);
            // console.log(ctx.request.body);
            const data = ctx.request.body as AlbumData;
            if (!name) throw new Error('Album name illegal!');
            this.albums.updateAlbum(name, data.data);
            await this.albums.saveAlbumToDisk();
        });

        this.router.get('/open', async (ctx) => {
            const filePath = ctx.URL.searchParams.get('path') || '';
            const type = ctx.URL.searchParams.get('type') || '';
            if (type === 'file') {
                await open(filePath);
            } else {
                await open(path.dirname(filePath));
            }
        });
    }
    setStatus = (): Middleware => {
        return async (ctx, next) => {
            await next();
            ctx.status = 200;
            ctx.body = ctx.body || { ret: 0 };
        }
    }
    public getRouter() {
        this.router.use(this.setStatus());
        this.buildRouter();
        return this.router;
    }
}
