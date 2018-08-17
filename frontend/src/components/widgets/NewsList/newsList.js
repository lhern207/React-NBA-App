import React, { Component } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_API } from '../../../config';
import style from './newsList.css';
import Button from '../Buttons/buttons';
import CardInfo from '../CardInfo/cardinfo';

class NewsList extends Component {

    state={
        teams:[],
        items:[],
        start: this.props.start,
        end: this.props.end,
        amount: this.props.load_amount,
    }

    componentDidMount() {
        this.request(this.state.start, this.state.end);
    }

    request = (start, end) => {
        if(this.state.teams.length < 1) {
            axios.get(`${BACKEND_API}/teams`).then(
                response => {
                    this.setState({
                        teams: response.data
                    });
                }
            )
            .catch(e => {
                console.log(e);
            });
        }
        axios.get(`${BACKEND_API}/articles?_start=${start}&_end=${end}`).then(
            response => {
                this.setState({
                    items: [...this.state.items, ...response.data],
                    start,
                    end
                });
            }
        )
        .catch(e => {
            console.log(e);
        });
    }

    loadMore = () => {
        let start = this.state.start + this.state.amount;
        let end = this.state.end + this.state.amount;
        this.request(start, end);
    }

    renderNews = (type) => {
        let template = null;

        switch(type){
            case('card'):
                template= this.state.items.map ( (item, i) => {
                    return(
                        <CSSTransition
                            classNames={{
                                enter:style.newslist_wrapper,
                                enterActive:style.newslist_wrapper_enter
                            }}
                            timeout={500}
                            key={i}
                        >
                            <div>
                                <div className={style.newslist_item}>
                                    <Link to={`/articles/${item.id}`}>
                                        <CardInfo 
                                            allTeams={this.state.teams} 
                                            teamID={item.team} 
                                            date={item.date}
                                        />
                                        <h2>{item.title}</h2>
                                    </Link>
                                </div>
                            </div>
                        </CSSTransition>
                    )
                })
                break;
            case('imageCard'):
                template= this.state.items.map ( (item, i) => {
                    return(
                        <CSSTransition
                            classNames={{
                                enter:style.newslist_wrapper,
                                enterActive:style.newslist_wrapper_enter
                            }}
                            timeout={500}
                            key={i}
                        >
                            <div>
                                <Link to={`/articles/${item.id}`}>
                                    <div className={style.imageCard_wrapper}>
                                        <div className={style.imageCard_left}
                                            style={{
                                                background: `url(/images/articles/${item.image})`
                                            }}
                                        >
                                            <div></div>
                                        </div>
                                        <div className={style.imageCard_right}>
                                            <CardInfo 
                                                allTeams={this.state.teams} 
                                                teamID={item.team} 
                                                date={item.date}
                                            />
                                            <h2>{item.title}</h2>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </CSSTransition>
                    )
                })
                break;
            default:
                template = null;
        }
        return template;
    }

    render() {
        return (
            <div>
                <TransitionGroup
                    component="div"
                    className="list"
                >
                    {this.renderNews(this.props.type)}
                </TransitionGroup>
                <Button
                    type="loadmore"
                    action={() => this.loadMore()}
                    cta="Load More News"
                />
            </div>
        );
    }
}

export default NewsList;