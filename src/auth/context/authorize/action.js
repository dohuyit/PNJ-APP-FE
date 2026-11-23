'use client';

import axios from 'src/lib/axios';


export const processAuthorizeCallbackRequest = async (authCode) => {
    const path = '/auth/callback?code=' + authCode
    const res = await axios.get(path);
    if (res.status === 200) {
        const {user} = res.data.data;
        const {token} = res.data.data;
        return {
            user,
            token,
        };
    }
    return null;
}

export const getMe = async () => {
    const path = '/api/auth/me'
    const res = await axios.get(path);
    if (res.status === 200) {
        // console.log("---getMe", res.data)
    }
}
