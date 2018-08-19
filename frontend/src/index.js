import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';

let user = {
    email: '',
    loggedOn: false
}

const App = (props) => {
    return (
        <BrowserRouter>
            <Routes {...props}/>
        </BrowserRouter>
    )
}

ReactDOM.render(<App user={user}/>, document.getElementById('root'));
