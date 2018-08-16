import React from 'react';
import { Link } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';

import style from './header.css';
import SideNavigation from './SideNav/sideNav';

const Header = (props) => {

    const logo = () => {
        return (
            <Link to="/" className={style.logo}>
                <img alt="nba logo" src="/images/nba_logo.png"/>
            </Link>
        )
    }

    const navBars = () => {
        return (
            <div className={style.bars}>
                <FontAwesome
                    name="bars"
                    onClick={props.onOpenNav}
                />
            </div>
        )
    }

    return (
        <header className={style.header}>
            <SideNavigation {...props}/>
            <div className={style.headerOpt}>
                {navBars()}
                {logo()}
            </div>
        </header>
    );
};

export default Header;