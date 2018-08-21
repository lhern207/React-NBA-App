import React, { Component } from 'react';

class Uploader extends Component {

    state = {
        name: '',
        isUploading: false,
        progress: 0,
        fileURL: ''
    }

    render() {
        return (
            <div>
                uploader
            </div>
        );
    }
}

export default Uploader;