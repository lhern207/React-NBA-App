import React from 'react';
import style from './buttons.css';
import { Link } from 'react-router-dom';

const Button = (props) => {
    let template = null;
    
    switch(props.type){
        case('loadmore'):
            template = (
                <div className={style.blue_btn}
                    onClick={props.action}
                >
                    {props.cta}
                </div>
            );
            break;
        case('linkTo'):
            template = (
                <Link 
                    to={props.route}
                    className={style.blue_btn}
                >
                    { props.cta }
                </Link>
            )
            break;
        default:
            template = null;
    }
    return template;
};

export default Button;