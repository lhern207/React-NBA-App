import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import style from './sideNav.css';
import axios from 'axios';
import {BACKEND_API} from '../../../config';



const SideNavItems = (props) => {

    const items = [
        {
            type: style.option,
            icon: 'home',
            text: 'Home',
            link: '/',
            login: ''
        },
        {
            type: style.option,
            icon: 'file-text-o',
            text: 'News',
            link: '/news',
            login: ''
        },
        {
            type: style.option,
            icon: 'play',
            text: 'Videos',
            link: '/videos',
            login: ''
        },
        {
            type: style.option,
            icon: 'sign-in',
            text: 'Dashboard',
            link: '/dashboard',
            login: true
        },
        {
            type: style.option,
            icon: 'sign-in',
            text: 'Sign in',
            link: '/sign-in',
            login: false
        },
        {
            type: style.option,
            icon: 'sign-out',
            text: 'Sign out',
            link: '/sign-out',
            login: true
        }
    ];

    const showItems = () => {
        return ( 
            items.map( (item, i) => {
                return item.login !== '' ?
                restricted(item,i)
                :
                element(item, i)
            })
        )
    }

    const restricted = (item, i) => {
        let template = null;
        if(sessionStorage.getItem('loggedIn') !== 'true' && !item.login){
            template = element(item,i);
        }
        if(sessionStorage.getItem('loggedIn') === 'true' && item.login){
            if(item.link === '/sign-out'){
                template = (
                    <div key={i} 
                        className={item.type}
                        onClick={Logout}
                        >
                        <FontAwesome name={item.icon}/>
                        {item.text}
                        
                    </div>
                )
            }
            else{
                template = element(item,i);
            }
        }

        return template;
    }

    const element = (item, i) => {
        return (
            <div key={i} className={item.type}>
                <Link to={item.link}>
                    <FontAwesome name={item.icon}/>
                    {item.text}
                </Link>
            </div>
        )
    }

    const Logout = () => {
        axios.post(`${BACKEND_API}/user/logout`, {}, {withCredentials:true})
        .then(response => {
            sessionStorage.removeItem("email");
            sessionStorage.removeItem("loggedIn");
            props.history.push('/');
        })
        .catch(e=>{
            throw e;
        });
    }

    return (
        <div>
            {showItems()}
        </div>
    );
};

export default withRouter(SideNavItems);