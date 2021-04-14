import fsPromises from 'fs/promises';
import path from 'path';
export const createDirIfNotExist = async (dirPath: string) => {
    let dirStat;
    try {
        dirStat = await fsPromises.stat(dirPath);
    } catch (e) { }
    if (!(dirStat?.isDirectory())) {
        await fsPromises.mkdir(dirPath, { recursive: true });
        return false;
    }
    return true;
}

export const fileExist = async (path: string) => {
    try {
        await fsPromises.access(path);
        return true;
    } catch (e) {
        return false;
    }
};
export const getAllFiles = async (dirPath: string) => {
    const ret = [];
    const files = await fsPromises.readdir(dirPath, { withFileTypes: true });
    for (const file of files) {
        const filePath = path.join(dirPath, file.name);
        if (file.isDirectory()) {
            await getAllFiles(filePath);
        } else if (file.isFile()) {
            ret.push({ name: file.name, filePath });
        }
    }
    return ret;
}