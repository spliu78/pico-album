"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
class PicoRouter {
    constructor(fileList, albumList) {
        this.router = new koa_router_1.default();
        this.fileList = fileList;
        this.albums = albumList;
    }
    buildRouter() {
        this.router.get('/get_files', async (ctx) => {
            ctx.body = this.fileList;
        });
        // create_album?name=
        this.router.get('/create_album', async (ctx) => {
            const name = ctx.URL.searchParams.get('name');
            if (!name)
                throw new Error('Album name illegal!');
            this.albums.createAlbum(name);
            await this.albums.saveAlbumToDisk();
        });
        this.router.get('/rename_album', async (ctx) => {
            const name = ctx.URL.searchParams.get('name');
            const newName = ctx.URL.searchParams.get('new_name');
            if (!name || !newName)
                throw new Error('Album name illegal!');
            this.albums.renameAlbum(name, newName);
            await this.albums.saveAlbumToDisk();
        });
        this.router.get('/remove_album', async (ctx) => {
            const name = ctx.URL.searchParams.get('name');
            if (!name)
                throw new Error('Album name illegal!');
            this.albums.removeAlbum(name);
            await this.albums.saveAlbumToDisk();
        });
        this.router.get('/get_all_album', async (ctx) => {
            ctx.body = this.albums.getAlbums();
        });
        this.router.get('/get_album', async (ctx) => {
            const name = ctx.URL.searchParams.get('name');
            if (!name)
                throw new Error('Album name illegal!');
            ctx.body = this.albums.getAlbum(name);
        });
        this.router.get('/export_album', async (ctx) => {
            const name = ctx.URL.searchParams.get('name');
            if (!name)
                throw new Error('Album name illegal!');
            this.albums.exportAlbum(name);
        });
        this.router.all('/update_album', async (ctx) => {
            const name = ctx.URL.searchParams.get('name');
            console.log(name);
            console.log(ctx.request.body);
            // const data = ctx.request.body as AlbumData;
            // try {
            //     if (!name) throw new Error('Album name illegal!');
            //     this.albums.updateAlbum(name, data);
            //     await this.albums.saveAlbum();
            // } catch (e) {
            // }
        });
    }
    getRouter() {
        this.buildRouter();
        return this.router;
    }
}
exports.default = PicoRouter;
//# sourceMappingURL=PicoRouter.js.map