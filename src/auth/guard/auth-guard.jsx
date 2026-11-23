'use client';

import { useState, useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';
import { getAuthUser } from '../../utils/auth';
import { JWT_STORAGE_KEY } from '../context/basic';
// ----------------------------------------------------------------------

const signInPaths = {
  jwt: paths.auth.jwt.signIn,
  auth0: paths.auth.auth0.signIn,
  amplify: paths.auth.amplify.signIn,
  firebase: paths.auth.firebase.signIn,
  supabase: paths.auth.supabase.signIn,
  authorize: paths.auth.authorize.signIn,
    login: paths.login
};

export function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();


  const { authenticated, loading } = useAuthContext();

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem(JWT_STORAGE_KEY);
            const storedUser = getAuthUser()
            setUser(storedUser)
            setToken(storedToken);
        }
    }, []);

  const [isChecking, setIsChecking] = useState(true);

  const createRedirectPath = (currentPath) => {
    const queryString = new URLSearchParams({ returnTo: pathname }).toString();
    return `${currentPath}?${queryString}`;
  };

  const checkPermissions = async () => {
    if (loading) {
      return;
    }

    // if (!authenticated) {
    //   // const { method } = CONFIG.auth;
    //
    //   // const signInPath = signInPaths[method];
    //   // const redirectPath = createRedirectPath(signInPath);
    //
    //   //   console.log('-------------unauthenticated', redirectPath, method, signInPath)
    //   const res = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/login`)
    //   const { redirect_url } = res.data.data
    //   router.replace(redirect_url)
    //
    //   return;
    // }
    if (!authenticated) {
        const { method } = CONFIG.auth;

        const signInPath = signInPaths[method];
        const redirectPath = createRedirectPath(signInPath);

        router.replace(redirectPath);

        return;
    }

      // if (user?.init_verified === false) {
      //     router.replace('/complete-profile');
      // }

      setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
