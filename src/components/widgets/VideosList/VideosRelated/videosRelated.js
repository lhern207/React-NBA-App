import React from 'react';
import style from '../videosList.css';
import VideosTemplate from '../videosTemplate';

const VideosRelated = (props) => {
    return (
        <div className={style.relatedWrapper}>
            <VideosTemplate
                data={props.data}
                teams={props.teams}
            />
        </div>
    );
};

export default VideosRelated;