'use client';

import { useRouter } from 'next/navigation';
import {useSetState} from 'minimal-shared/hooks';
import {useMemo, useEffect, useCallback} from 'react';

import axios, {endpoints} from 'src/lib/axios';

import {setSession} from './utils';
import {AuthContext} from '../auth-context';
import {USER_INFO_KEY, JWT_STORAGE_KEY} from './constant';

// ----------------------------------------------------------------------

export function AuthProvider({children}) {
    const {state, setState} = useSetState({user: null, loading: true});
    const router = useRouter()

    const checkUserSession = useCallback(async () => {
        try {
            const accessToken = localStorage.getItem(JWT_STORAGE_KEY);

            if (accessToken) {
                setSession(accessToken);

                const res = await axios.get(endpoints.auth.me);

                const user = await res.data?.data;
                localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
                // localStorage.setItem(USER_ROLES_KEY, JSON.stringify(roles));
                // localStorage.setItem(USER_BRANCHES_KEY, JSON.stringify(branches));
                // localStorage.setItem(USER_PERMISSION_CODES_KEY, JSON.stringify(permission_codes));
                // localStorage.setItem(USER_ENABLE_PERMISSION, enable_permission);
                // if(user?.init_verified === false){
                //     router.replace('/complete-profile')
                // }

                setState({user: {...user, accessToken}, loading: false});
            } else {
                setState({user: null, loading: false});
            }
        } catch (error) {
            console.error(error);
            setState({user: null, loading: false});
        }
    }, [setState]);

    useEffect(() => {
        checkUserSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ----------------------------------------------------------------------

    const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

    const status = state.loading ? 'loading' : checkAuthenticated;

    const memoizedValue = useMemo(
        () => ({
            user: state.user ? {...state.user, role: state.user?.role ?? 'admin'} : null,
            checkUserSession,
            loading: status === 'loading',
            authenticated: status === 'authenticated',
            unauthenticated: status === 'unauthenticated',
        }),
        [checkUserSession, state.user, status]
    );

    return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
