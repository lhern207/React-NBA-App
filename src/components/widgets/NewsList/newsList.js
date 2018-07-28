import React, { Component } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_API } from '../../../config';
import style from './newsList.css';
import Button from '../Buttons/buttons';

class NewsList extends Component {

    state={
        items:[],
        start: this.props.start,
        end: this.props.end,
        amount: this.props.load_amount,
    }

    componentWillMount() {
        this.request(this.state.start, this.state.end);
    }

    request = (start, end) => {
        axios.get(`${BACKEND_API}/articles?_start=${start}&_end=${end}`).then(
            response => {
                this.setState({
                    items: [...this.state.items, ...response.data]
                })
            }
        )
    }

    loadMore = () => {
        let start = this.state.end;
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
                                        <h2>{item.title}</h2>
                                    </Link>
                                </div>
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
        //console.log(this.state.items)
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