import React, { Component } from 'react';
import axios from 'axios';
import { BACKEND_API } from '../../../../config';
import style from '../../articles.css';
import Header from './header';
import VideosRelated from '../../../widgets/VideosList/VideosRelated/videosRelated';

class VideosArticle extends Component {

    state = {
        article: [],
        team: [],
        teams: [],
        related: []
    }

    componentWillMount() {
        axios.get(`${BACKEND_API}/videos?id=${this.props.match.params.id}`).then(
            response => {
                let article = response.data[0];

                axios.get(`${BACKEND_API}/teams?id=${article.team}`).then(
                    response => {
                        this.setState({
                            article,
                            team: response.data
                        });
                        this.getRelated();
                    }
                )
            }
        )
    }

    getRelated = () => {
        axios.get(`${BACKEND_API}/teams`).then(
            response => {
                let teams = response.data;
                axios.get(`${BACKEND_API}/videos?q=${this.state.team[0].city}&_limit=3`)
                .then(response => {
                    this.setState({
                        teams,
                        related: response.data
                    })
                })
            }
        )
    }

    render() {

        const article = this.state.article;
        const team = this.state.team;

        return (
            <div>
                <Header teamData={team[0]}/>
                <div className={style.videoWrapper}>
                    <h1>{article.title}</h1>
                    <iframe
                        title="videoplayer"
                        width="100%"
                        height="300px"
                        src={`https://www.youtube.com/embed/${article.url}`}
                    >
                    </iframe>
                </div>
                <VideosRelated
                    data={this.state.related}
                    teams={this.state.teams}
                />
            </div>
        );
    }
}

export default VideosArticle;