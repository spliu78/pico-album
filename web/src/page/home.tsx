import React, { ChangeEvent, MouseEvent, SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
interface HomeState {
    albums?: Array<AlbumData>,
    createMsg: string | null,
    newAlbumName: string,
}
export default class Home extends React.Component<{}, HomeState> {
    constructor(props: {} | Readonly<{}>) {
        super(props);
        this.state = { createMsg: null, newAlbumName: '' };
    }
    async componentDidMount() {
        // GetAlbums
        await this.getAllAlbum();
    }
    async getAllAlbum() {
        try {
            const albums = await fetch('/get_all_album').then(data => data.json());
            this.setState({ albums });
        } catch (e) { }
    }
    async createAlbum(e: SyntheticEvent) {
        e.preventDefault();
        try {
            const res = await fetch(`/create_album?name=${this.state.newAlbumName}`).then(data => data.json());
            if (res.ret === -1) {
                this.setState({ createMsg: res.msg });
            } else {
                this.setState({ createMsg: "Create Success!" });
                this.getAllAlbum();
            }
        } catch (e) {
            alert(e);
        }
    }
    newAlbumNameChange(e: SyntheticEvent<HTMLInputElement>) {
        const newAlbumName = e.currentTarget.value;
        this.setState({ newAlbumName });
    }
    render() {
        return (
            <div>
                <div>{this.state.albums ? JSON.stringify(this.state.albums) : 'none'}</div>
                <hr />
                <div>
                    new album name：<input type="string" onChange={this.newAlbumNameChange.bind(this)} />
                    {this.state.createMsg}
                    <div>
                        <a href="" onClick={this.createAlbum.bind(this)}>Create Album</a>
                    </div>
                </div>
                <hr />
                <div>
                    <Link to="work">Pico pick</Link>
                </div>
            </div>
        );
    }
}
