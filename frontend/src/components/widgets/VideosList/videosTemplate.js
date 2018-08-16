import React from 'react';
import style from './videosList.css';
import { Link } from 'react-router-dom';
import CardInfo from '../CardInfo/cardinfo';

const VideosTemplate = (props) => {
    return (
        props.data.map( (item, i) => {
            return (
                <Link to={`/videos/${item.id}`} key={i}>
                    <div className={style.videoListItem_wrapper}>
                        <div className={style.left}
                            style={{
                                background: `url(/images/videos/${item.image})`
                            }}
                        >
                            <div>
                            </div>
                        </div>
                        <div className={style.right}>
                            <CardInfo allTeams={props.teams} teamID={item.team} date={item.date}/>
                            <h2>{item.title}</h2>
                        </div>
                    </div>
                </Link>
            )
        })
    );
};

export default VideosTemplate;