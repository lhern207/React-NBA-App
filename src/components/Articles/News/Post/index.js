import React, { Component } from 'react';
import axios from 'axios';
import { BACKEND_API } from '../../../../config';
import style from '../../articles.css';
import Header from './header';
import Body from './body';

class NewsArticles extends Component {

    state = {
        article: [],
        team: []
    }

    componentWillMount() {
        axios.get(`${BACKEND_API}/articles?id=${this.props.match.params.id}`).then(
            response => {
                let article = response.data[0];

                axios.get(`${BACKEND_API}/teams?id=${article.team}`).then(
                    response => {
                        this.setState({
                            article,
                            team: response.data
                        })

                    }
                )
            }
        )
    }

    render() {

        const article = this.state.article;
        const team = this.state.team;

        return (
            <div className = {style.articleWrapper}>
                <Header
                    teamData={team[0]}
                    date={article.date}
                    author={article.author}
                />
                <Body/>
            </div>
        );
    }
}

export default NewsArticles;