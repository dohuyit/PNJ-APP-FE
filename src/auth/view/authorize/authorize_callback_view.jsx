'use client';

import { useEffect} from "react";
import {useSearchParams} from "next/navigation";

import {useTheme} from '@mui/material/styles';

import {useAuthContext} from "../../hooks";
import {useRouter} from "../../../routes/hooks";
import {setSession} from "../../context/authorize/utils";
import {SplashScreen} from "../../../components/loading-screen";
import { processAuthorizeCallbackRequest} from "../../context/authorize/action";

// ----------------------------------------------------------------------

export function AuthorizeCallbackView() {
    const theme = useTheme();
    const router = useRouter();
    const searchParams = useSearchParams();
    const {checkUserSession} = useAuthContext();

    useEffect(() => {
        processCallbackAuthorize()
    }, []);

    const processCallbackAuthorize = () => {
        const code = searchParams.get('code');
        processAuthorizeCallbackRequest(code).then(result => {
            const user = result.user;
            const token = result.token;
            if (user) {
                setSession(token)
                checkUserSession?.();
                router.refresh();
            }
        })
    }

    return <SplashScreen/>;
}
