import React from 'react';
import FontAwesome from 'react-fontawesome';
import style from './cardinfo.css';

const CardInfo = (props) => {

    const getTeamName = (allTeams, teamID) => {
        let data = allTeams.find((item) => {
            return (
                item.id === teamID
            )
        });
        if(data){
            return data.name;
        }
    }

    return (
        <div className={style.cardInfo}>
            <span className={style.teamName}>
                {getTeamName(props.allTeams,props.teamID)}
            </span>
            <span className={style.date}>
                <FontAwesome name="clock-o"/>
                {props.date}
            </span>
        </div>
    );
};

export default CardInfo;