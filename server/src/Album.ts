import path from "path";
import { fileExist } from "./util";
import fsPromises from 'fs/promises';
import moment from "moment";

export default class Albums {
    albums: Map<AlbumData["name"], AlbumData> = new Map();
    dataPath: string;
    constructor(albumPath: string) {
        this.dataPath = path.join(albumPath, './.pico/AlbumInfo.data');
    }
    public async loadAlbum(albumPath: string) {
        if (await fileExist(this.dataPath)) {
            let obj: { [prop: string]: AlbumData } = {};
            try {
                obj = JSON.parse(await fsPromises.readFile(this.dataPath, 'utf-8'));

            } catch (e) { }

            for (const key in obj) {
                this.albums.set(key, obj[key]);
            }
        }
    }
    public createAlbum(name: string) {
        if (this.albums.has(name)) throw new Error('Album already exist!');
        const createTime = moment().format();
        const modifyTime = createTime;
        this.albums.set(name, { name, createTime, modifyTime, data: [] });
    }
    public renameAlbum(name: string, newName: string) {
        const album = this.albums.get(name);
        if (!album) throw new Error('Album not exist!');
        this.albums.delete(name);
        album.name = newName;
        album.modifyTime = moment().format();
        this.albums.set(newName, album);
    }
    public removeAlbum(name: string) {
        return this.albums.delete(name);
    }
    public getAlbum(name: string) {
        return this.albums.get(name);
    }
    public async saveAlbumToDisk() {
        const data: { [prop: string]: AlbumData } = {};
        this.albums.forEach((albumData, name) => {
            data[name] = albumData;
        });
        await fsPromises.writeFile(this.dataPath, JSON.stringify(data));
    }
    public updateAlbum(name: string, data: Array<AlbumFile>) {
        const album = this.albums.get(name);
        if (!album) throw new Error('Album not exist!');
        album.data = data;
        album.modifyTime = moment().format();
        this.albums.set(name, album);
    }
    public getAlbums() {
        const arr: Array<AlbumData> = [];
        this.albums.forEach((albumData, name) => {
            arr.push(albumData);
        });
        return arr;
    }
    public async exportAlbum(name: string) {
        // TODO
    }
}