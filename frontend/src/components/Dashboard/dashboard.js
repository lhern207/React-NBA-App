import React, { Component } from 'react';
import style from './dashboard.css';
import FormField from '../widgets/FormFields/formFields';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertFromRaw, convertToRaw} from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import axios from 'axios';
import {BACKEND_API} from '../../config';
import Uploader from '../widgets/FileUploader/fileUploader';

class Dashboard extends Component {

    state = {
        editorState: EditorState.createEmpty(),
        postError:'',
        loading: false,
        formdata: {
            author: {
                element: 'input',
                value: '',
                config : {
                    name: 'author_input',
                    type: 'text',
                    placeholder: 'Enter author name'
                },
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
                validationMessage: ''
            },
            title: {
                element: 'input',
                value: '',
                config : {
                    name: 'title_input',
                    type: 'text',
                    placeholder: 'Enter the title'
                },
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
                validationMessage: ''
            },
            body: {
                element: 'texteditor',
                value: '',
                valid: true
            },
            team: {
                element: 'select',
                value: '',
                config : {
                    name: 'team_input',
                    options: []
                },
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
                validationMessage: ''
            },
            image: {
                value: '',
                valid: true
            }
        }
    }

    componentDidMount(){
        //Load Teams
        axios.get(`${BACKEND_API}/teams`)
        .then(response => {
            let teams = [];
            response.data.forEach((team)=>{
                teams.push({
                    id: team.id,
                    name: team.name
                });
            });
            const newFormData = {...this.state.formdata};
            newFormData['team'].config.options = teams;
            this.setState({
                formdata: newFormData
            });
        })
        .catch(e=>{
            throw e;
        });
    }

    //Second argument behavior is ES6 exclusive.
    //If content is not passed. It will have a default value of ''.
    updateForm = (element, content = '') => {
        let newFormData = {...this.state.formdata};

        //Change whatever element was changed. 
        //We can identify it by the id passed to formFields
        if(content === '') {
            newFormData[element.id].value = element.event.target.value;
        }
        else{
            newFormData[element.id].value = content;
        }

        //Validate the changed element
        if(element.blur){
            let validData = this.validate(newFormData[element.id]);
            newFormData[element.id].valid = validData[0];
            newFormData[element.id].validationMessage = validData[1];
        }

        newFormData[element.id].touched = element.blur;

        this.setState({
            formdata: newFormData
        });
    }

    validate = (element) => {
        //Error true indicates there's no error. Field data is valid.
        let error = [true, ''];

        if(element.validation.required){
            const valid = element.value.trim() !== '';
            const message = `${!valid ? 'This field is required' : ''}`;
            error = !valid ? [false,message] : error;
        }

        return error;
    }

    submitButton = ()=>{
        return (
            this.state.loading ? 
            'loading...'
            :
            (
                <div>
                    <button type="submit">Add Post</button>
                </div>
            )
        )
    }

    submitForm = (event) => {
        event.preventDefault();

        let dataToSubmit = {};
        let formIsValid = true;

        for(let key in this.state.formdata){
            dataToSubmit[key] = this.state.formdata[key].value;

            if(!this.state.formdata[key].valid){
                formIsValid = false;
                break;
            }
        }

        if(formIsValid){
            this.setState({
                loading: true,
                postError: ''
            });

            axios.post(`${BACKEND_API}/articles`, dataToSubmit, {withCredentials: true})
            .then(response => {
                this.setState({
                    loading: false,
                    postError: ''
                });
                //Redirect to article
                this.props.history.push(`/articles/${response.data.article}`);
            })
            .catch(e=>{
                this.setState({
                    loading: false,
                    postError: 'Article failed to upload to server'
                });
            });
        }
        else{
            this.setState({
                loading: false,
                postError: 'Something went wrong'
            });
        }

    }

    showError = ()=>{
        return (
            this.state.postError !== '' ?
            <div className={style.Error}>{this.state.postError}</div>
            :
            null
        )
    }

    onEditorStateChange = (editorState) => {
        let contentState = editorState.getCurrentContent();
        //let rawState = convertToRaw(contentState);
        //=Store raw
        //=Retrieve raw
        //contentState = convertFromRaw(rawState);
        let html = stateToHTML(contentState);
        //=Display on page

        this.updateForm({id:'body'}, html);

        this.setState({
            editorState
        });
    }

    previewImage = (image) => {
        this.updateForm({id:'image'}, image);
    }

    render() {
        return (
            <div className = {style.postContainer}>
                <form onSubmit={this.submitForm}>
                    <h2>Add Post</h2>
                    <Uploader onLoad={(image) => this.previewImage(image)}/>
                    <img src={this.state.formdata.image.value} height="80" alt=""/>
                    <FormField
                        id={'author'}
                        formData={this.state.formdata.author}
                        change={(element)=>this.updateForm(element)}
                    />
                    <FormField
                        id={'title'}
                        formData={this.state.formdata.title}
                        change={(element)=>this.updateForm(element)}
                    />
                    <Editor
                        editorState = {this.state.editorState}
                        toolbar= {{
                            options: ['inline', 'fontSize', 'fontFamily', 
                            'list', 'textAlign', 'colorPicker' ],
                            inline: { inDropdown: true },
                            list: { inDropdown: true },
                            textAlign: { inDropdown: true },
                        }}
                        wrapperClassName = "myEditor_wrapper"
                        editorClassName = "myEditor_editor"
                        onEditorStateChange = {this.onEditorStateChange}
                    />
                    <FormField
                        id={'team'}
                        formData={this.state.formdata.team}
                        change={(element)=>this.updateForm(element)}
                    />
                    { this.submitButton() }
                    { this.showError() }
                </form>
            </div>
        );
    }
}

export default Dashboard;