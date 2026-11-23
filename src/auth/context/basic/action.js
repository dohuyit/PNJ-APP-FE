'use client';

import axios, {endpoints} from 'src/lib/axios';

import {setSession} from './utils';
import {JWT_STORAGE_KEY, USER_STORAGE_KEY} from './constant';

/** **************************************
 * Sign in
 *************************************** */

// ----------------------------------------------------------------------

export const getCsrfSession = async () => {
  const res = await axios.get('/sanctum/csrf-cookie');
}
export const signInWithPassword = async ({email, password, appId, redirectUrl, signature}) => {
  await getCsrfSession().then(async () => {
    try {
      const params = {
        email,
        password,
        app_id: appId,
        redirect_url: redirectUrl,
        signature,
      };
      const res = await axios.post(endpoints.auth.signIn, params);

      // const {redirect_url} = res.data.data;
      // console.log("--redirect_url", res, res.data.data)
      //   if (redirect_url) {
      //       window.location.href = redirect_url
      //   }
        const {token, customer, redirect_url} = await res.data.data;
        if (redirect_url) {
            window.location.href = redirect_url
        } else if (token && customer) {
            localStorage.setItem(JWT_STORAGE_KEY, token)
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(customer))
            window.location.href = '/dashboard'
        }



      // setSession(accessToken);
    } catch (error) {
      // console.error('Error during sign in:', error);
      throw error;
    }
  })

};

/** **************************************
 * Sign up
 *************************************** */

// ----------------------------------------------------------------------

export const signUp = async ({email, password, firstName, lastName}) => {
  const params = {
    email,
    password,
    firstName,
    lastName,
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);

    const {accessToken} = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    sessionStorage.setItem(JWT_STORAGE_KEY, accessToken);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */

// ----------------------------------------------------------------------

export const signOut = async () => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
