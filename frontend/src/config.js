import fs from 'fs';

const CURRENT_YEAR = new Date().getFullYear();
let BACKEND_API = 'https://api-newsatnba.herokuapp.com';
/* fs.exists('../../dev', (exists)=>{
    if(!exists){
        BACKEND_API = 'https://api-newsatnba.herokuapp.com';
    }
    else{
        BACKEND_API = 'http://localhost:3004';
    }
}); */

export {
    CURRENT_YEAR,
    BACKEND_API
}