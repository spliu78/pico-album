import { Context, DefaultState } from 'koa';
import Router from 'koa-router';



export default class PicoRouter {
    fileList: Array<AlbumFile>;
    router = new Router();
    constructor(fileList: Array<AlbumFile>) {
        this.fileList = fileList;
    }
    private buildRouter() {
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
    public getRouter() {
        this.buildRouter();
        return this.router;
    }
}