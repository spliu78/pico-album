declare interface AlbumFile {
    file: string;
    filePath: string;
    mime: string;
}

declare interface AlbumData {
    name: string;
    createTime: string;
    modifyTime: string;
    data: Array<AlbumFile>;
}
