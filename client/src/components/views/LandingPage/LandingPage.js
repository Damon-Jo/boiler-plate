import React, { useEffect } from 'react';
import axios from 'axios';

function LandingPage(){

    useEffect(() => {
        axios.get('/api/hello')
            .then(response => { console.log(response) })
    }, [])

    return (
        <div>
            <h1>Landing Page</h1>
        </div>
    )
}

export default LandingPage;