import React from 'react';
interface WorkPageState {
    albums: Array<AlbumData>,
    files: Array<AlbumFile>,
    selected: Set<Number>,
}

export default class WorkPage extends React.Component<{}, WorkPageState> {
    constructor(props: {} | Readonly<{}>) {
        super(props);
        this.state = { albums: [], files: [], selected: new Set() };
    }
    async componentDidMount() {
        // getFiles
        // getAlbums
        const files = await fetch('/get_files').then(data => data.json());
        const albums = await fetch('/get_all_album').then(data => data.json());
        this.setState({ albums, files });
    }

    async handleOpenFile(e: React.SyntheticEvent<HTMLElement>) {
        e.preventDefault();
        if (!(e.target instanceof HTMLElement)) return;
        const { index, type } = e.target.dataset;
        if (index === undefined || !type) return;
        await fetch(`/open?path=${this.state.files[Number(index)].filePath}&type=${type}`);
    }

    handleFileSelect(e: React.SyntheticEvent<HTMLElement>) {
        if (!(e.currentTarget instanceof HTMLElement) || e.currentTarget.dataset.index === undefined) return;
        const index = Number(e.currentTarget.dataset.index);
        const selected = this.state.selected;
        if (selected.has(index)) {
            selected.delete(index);
        } else {
            selected.add(index);
        }
        this.setState({ selected });
    }
    handlePickToAlbum(e: React.SyntheticEvent<HTMLElement>) {
        e.preventDefault();
        if (!(e.currentTarget instanceof HTMLElement) || e.currentTarget.dataset.album === undefined) return;
        const name = e.currentTarget.dataset.album;
        if (window.confirm(`Pick to ${name}, sure?`)) {
            console.log('sure');
        }
    }
    render() {
        return (
            <div>
                {this.state.selected.size ? (
                    <div>
                        Pick to Album:
                        {this.state.albums.map(({ name }, index) => (
                            <a key={index} onClick={this.handlePickToAlbum.bind(this)} data-album={name} href="" style={{ padding: '0 2px' }}>{name}</a>
                        ))}
                    </div>
                ) : ''}
                <div>
                    {this.state.files.map(({ file, filePath, mime }, index) => {
                        return (
                            <ul data-index={index} key={index} onClick={this.handleFileSelect.bind(this)}>
                                <input type="checkbox" checked={this.state.selected.has(index)} readOnly />
                                <li>name:{file}</li>
                                <li>path:{filePath}</li>
                                {mime.includes('image') && <img src={`/pico/${filePath}`} />}
                                {mime.includes('video') && <video src={`/pico/${filePath}`} />}
                                <li><a href="" data-index={index} data-type="file" onClick={this.handleOpenFile.bind(this)}>Open File</a></li>
                                <li><a href="" data-index={index} data-type="dir" onClick={this.handleOpenFile.bind(this)}>Open Dir</a></li>
                            </ul>
                        );
                    })}
                </div>
            </div >
        );
    }
}