import React, { Component } from 'react';
import style from './signin.css';
import FormField from '../widgets/FormFields/formFields';
import axios from 'axios';
import {BACKEND_API} from '../../config';

class SignIn extends Component {

    state = {
        registerError:'',
        loading: false,
        formdata: {
            email: {
                element: 'input',
                value: '',
                config : {
                    name: 'email_input',
                    type: 'email',
                    placeholder: 'Enter your email'
                },
                validation: {
                    required: true,
                    email: true
                },
                valid: false,
                touched: false,
                validationMessage: ''
            },
            password : {
                element: 'input',
                value: '',
                config : {
                    name: 'password_input',
                    type: 'password',
                    placeholder: 'Enter your password'
                },
                validation: {
                    required: true,
                    password: true
                },
                valid: false,
                touched: false,
                validationMessage: ''
            }
        }
    }

    updateForm = (element) => {
        let newFormData = {...this.state.formdata};

        //Change whatever element was changed. 
        //We can identify it by the id passed to formFields
        newFormData[element.id].value = element.event.target.value;

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

        if(element.validation.email){
            const valid = /\S+@\S+\.\S+/.test(element.value);
            const message = `${!valid ? 'Must be a valid email' : ''}`;
            error = !valid ? [false,message] : error;
        }

        if(element.validation.password){
            const valid = element.value.length >= 5;
            const message = `${!valid ? 'Password minimum length: 5 characters' : ''}`;
            error = !valid ? [false,message] : error;
        }

        if(element.validation.required){
            const valid = element.value.trim() !== '';
            const message = `${!valid ? 'This field is required' : ''}`;
            error = !valid ? [false,message] : error;
        }

        return error;
    }

    submitForm = (event, type)=>{
        event.preventDefault();
        if(type !== null){
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
                    registerError: ''
                });

                if(type) {
                    //Login Request
                    axios.post(`${BACKEND_API}/user/login`, dataToSubmit)
                    .then(response => {
                        this.props.history.push('/');
                    })
                    .catch(e => {
                        this.setState({
                            loading: false,
                            registerError: e.response.data
                        });
                    });
                } 
                else{
                    //Register Request
                    axios.post(`${BACKEND_API}/user/register`, dataToSubmit)
                    .then(response => {
                        this.props.history.push('/');
                    })
                    .catch(e => {
                        this.setState({
                            loading: false,
                            registerError: e.response.data
                        });
                    });
                }
            }
        }
    }

    submitButton = ()=>{
        return (
            this.state.loading ? 
            'loading...'
            :
            (
                <div>
                    <button onClick={(event) => this.submitForm(event,false)}>Register Now</button>
                    <button onClick={(event) => this.submitForm(event,true)}>Log in</button>
                </div>
            )
        )
    }

    showError = ()=>{
        return (
            this.state.registerError !== '' ?
            <div className={style.Error}>{this.state.registerError}</div>
            :
            null
        )
    }

    render() {
        return (
            <div className={style.logContainer}>
                <form onSubmit={(event) => this.submitForm(event,null)}>
                    <h2>Register / Login</h2>
                    <FormField
                        id={'email'}
                        formData={this.state.formdata.email}
                        change={(element)=>this.updateForm(element)}
                    />
                    <FormField
                        id={'password'}
                        formData={this.state.formdata.password}
                        change={(element)=>this.updateForm(element)}
                    />
                    { this.submitButton() }
                    { this.showError() }
                </form>
            </div>
        );
    }
}

export default SignIn;