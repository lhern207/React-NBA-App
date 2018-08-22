import React, { Component } from 'react';
import style from './fileUploader.css';

class Uploader extends Component {

    state = {
        name: '',
        isUploading: false,
        progress: 0,
        fileURL: ''
    }

    handleFileUpload = (event) => {
        //Do not process file if it hasn't been attached
        if(!event.target.files[0]){
            return
        }

        let file = event.target.files[0];
        //let name = file.name;
        let image = null;

        var reader = new FileReader();

        reader.onload = () => {
            image = reader.result;
            this.props.onLoad(image);
        }
        reader.readAsDataURL(file);
    }

    render() {
        return (
            <div className={style.uploader}>
                <input type="file" onChange={this.handleFileUpload} accept='image/*'/>
            </div>
        )
    }
}

export default Uploader;