const request = require('request');

require('dotenv').config();

const getTokenOptions = {
    method: 'POST',
    url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form:
    {
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: process.env.AUTH0_AUDIENCE,
        grant_type: 'client_credentials'
    }
};

const getUserTokenOptions = {
    method: 'POST',
    url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    headers: { 
        'content-type': 'application/x-www-form-urlencoded'
    },
    form:
    { 
        grant_type: 'password',
        username: 'john.doe@gmail.com',
        password: 'P4ssW0rd',
        audience: process.env.AUTH0_AUDIENCE,
        scope: 'offline_access',
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET 
    }
};

const updateUserTokenOptions = (refreshToken) => {
    return {
        method: 'POST',
        url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        form:
        { 
            grant_type: 'refresh_token',
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            refresh_token: refreshToken
        }
    };
}

const changeUserPasswordOptions = (token) => {
    return {
        method: 'PATCH',
        url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/auth0|638cd9339b0c438142ecfa8c`,
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            password: 'Pa$$w0rd',
            connection: 'Username-Password-Authentication'
        })
    };    
};

request(getUserTokenOptions, (error, response, body) => {
    console.log(error);
    if (error) throw new Error(error);

    console.log(JSON.parse(body));
    console.log('========================');

    const refreshToken = JSON.parse(body).refresh_token;

    request(updateUserTokenOptions(refreshToken), (error, response, body) => {
        if (error) throw new Error(error);
    
        console.log(JSON.parse(body));
        console.log('========================');
    });
});

setTimeout(() => {
    request(getTokenOptions, (error, response, body) => {
        if (error) throw new Error(error);
    
        const accessToken = JSON.parse(body).access_token;
    
        console.log(JSON.parse(body));
        console.log('========================');
    
        request(changeUserPasswordOptions(accessToken), (error, response, body) => {
            if (error) throw new Error(error);
        
            console.log(JSON.parse(body));
            console.log('========================');
        });
    });
}, 5000);