"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const util_1 = require("./util");
const promises_1 = __importDefault(require("fs/promises"));
const moment_1 = __importDefault(require("moment"));
class Albums {
    constructor(albumPath) {
        this.albums = new Map();
        this.dataPath = path_1.default.join(albumPath, './.pico/AlbumInfo.data');
    }
    async loadAlbum(albumPath) {
        if (await util_1.fileExist(this.dataPath)) {
            let obj = {};
            try {
                obj = JSON.parse(await promises_1.default.readFile(this.dataPath, 'utf-8'));
            }
            catch (e) { }
            for (const key in obj) {
                this.albums.set(key, obj[key]);
            }
        }
    }
    createAlbum(name) {
        if (this.albums.has(name))
            throw new Error('Album already exist!');
        const createTime = moment_1.default().format();
        const modifyTime = createTime;
        this.albums.set(name, { name, createTime, modifyTime, data: [] });
    }
    renameAlbum(name, newName) {
        const album = this.albums.get(name);
        if (!album)
            throw new Error('Album not exist!');
        this.albums.delete(name);
        album.name = newName;
        album.modifyTime = moment_1.default().format();
        this.albums.set(newName, album);
    }
    removeAlbum(name) {
        return this.albums.delete(name);
    }
    getAlbum(name) {
        return this.albums.get(name);
    }
    async saveAlbumToDisk() {
        const data = {};
        this.albums.forEach((albumData, name) => {
            data[name] = albumData;
        });
        await promises_1.default.writeFile(this.dataPath, JSON.stringify(data));
    }
    updateAlbum(name, data) {
        const album = this.albums.get(name);
        if (!album)
            throw new Error('Album not exist!');
        album.data = data;
        album.modifyTime = moment_1.default().format();
        this.albums.set(name, album);
    }
    getAlbums() {
        const arr = [];
        this.albums.forEach((albumData, name) => {
            arr.push(albumData);
        });
        return arr;
    }
    async exportAlbum(name) {
        // TODO
    }
}
exports.default = Albums;
//# sourceMappingURL=Album.js.map