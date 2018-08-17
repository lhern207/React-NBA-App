import React, { Component } from 'react';
import axios from 'axios';
import { BACKEND_API } from '../../../config';
import SliderTemplates from './slider_templates';

class NewsSlider extends Component {

    state= {
        news: []
    }

    componentDidMount() {
        axios.get(`${BACKEND_API}/articles?_start=${this.props.start}&_end=${this.props.end}`).then(
            response => {
                this.setState({
                    news: response.data
                });
            }
        )
        .catch(e => {
            console.log(e);
        });
    }

    render() {
        return (
            <SliderTemplates 
                data={this.state.news} 
                type={this.props.type} 
                settings={this.props.settings}
            />
        )
    }
}

export default NewsSlider;