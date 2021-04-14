"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFiles = exports.fileExist = exports.createDirIfNotExist = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const createDirIfNotExist = async (dirPath) => {
    let dirStat;
    try {
        dirStat = await promises_1.default.stat(dirPath);
    }
    catch (e) { }
    if (!(dirStat === null || dirStat === void 0 ? void 0 : dirStat.isDirectory())) {
        await promises_1.default.mkdir(dirPath, { recursive: true });
        return false;
    }
    return true;
};
exports.createDirIfNotExist = createDirIfNotExist;
const fileExist = async (path) => {
    try {
        await promises_1.default.access(path);
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.fileExist = fileExist;
const getAllFiles = async (dirPath) => {
    const ret = [];
    const files = await promises_1.default.readdir(dirPath, { withFileTypes: true });
    for (const file of files) {
        const filePath = path_1.default.join(dirPath, file.name);
        if (file.isDirectory()) {
            await exports.getAllFiles(filePath);
        }
        else if (file.isFile()) {
            ret.push({ name: file.name, filePath });
        }
    }
    return ret;
};
exports.getAllFiles = getAllFiles;
//# sourceMappingURL=util.js.map