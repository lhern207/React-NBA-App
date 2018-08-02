import React, { Component } from 'react';
import style from './videosList.css';
import axios from 'axios';
import { BACKEND_API } from '../../../config';
import Button from '../Buttons/buttons';
import VideosTemplate from './videosTemplate';

class VideosList extends Component {

    state = {
        teams: [],
        videos: [],
        start: this.props.start,
        end: this.props.end,
        amount: this.props.amount,
    }

    componentWillMount() {
        this.request(this.state.start, this.state.end);
    }

    request = (start, end) => {
        if(this.state.teams.length < 1) {
            axios.get(`${BACKEND_API}/teams`).then(
                response => {
                    this.setState({
                        teams: response.data
                    })
                }
            )
        }
        axios.get(`${BACKEND_API}/videos?_start=${start}&_end=${end}`).then(
            response => {
                this.setState({
                    videos: [...this.state.videos, ...response.data],
                    start,
                    end
                })
            }
        )
    }

    loadMore = () => {
        let start = this.state.end;
        let end = this.state.end + this.state.amount;
        this.request(start, end);
    }

    renderTitle = () => {
        return (
            this.props.title ? 
            <h3><strong>NBA</strong> Videos</h3>
            : 
            null
        )
    }

    renderVideos = () => {
        let template = null;

        switch(this.props.type){
            case('card'):
                template = (
                <VideosTemplate 
                    data={this.state.videos} 
                    teams={this.state.teams}
                />
                )
                break;
            default:
                template=null;
        }
        return template;
    }

    renderButton = () => {
        return (
            this.props.loadmore ? 
            <Button 
                type="loadmore"
                action={() => this.loadMore()}
                cta="Load More Videos"
            />
            : 
            <Button 
                type="linkTo"
                route="/videos"
                cta="More Videos"
            />
        )
    }

    render() {
        return (
            <div className={style.videosList_wrapper}>
                { this.renderTitle() }
                { this.renderVideos() }
                { this.renderButton() }
            </div>
        );
    }
}

export default VideosList;