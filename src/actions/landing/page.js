// Landing page aggregator — /api/landing/v1/page/{home,about,contact}
import { useMemo } from 'react';
import useSWR from 'swr';

import axiosInstance, { fetcher } from 'src/lib/axios';

const swrOptions = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export const useGetHomePage = (fetched = true) => {
    const url = '/api/landing/v1/page/home';
    const { data, isLoading, error, isValidating } = useSWR(fetched ? url : null, fetcher, swrOptions);

    return useMemo(() => ({
        page: data?.data?.page ?? null,
        sections: data?.data?.sections ?? null,
        loading: isLoading || isValidating,
        error,
    }), [data, isLoading, isValidating, error]);
};

export const useGetAboutPage = (fetched = true) => {
    const url = '/api/landing/v1/page/about';
    const { data, isLoading, error } = useSWR(fetched ? url : null, fetcher, swrOptions);

    return useMemo(() => ({
        page: data?.data?.page ?? null,
        sections: data?.data?.sections ?? null,
        loading: isLoading,
        error,
    }), [data, isLoading, error]);
};

export const useGetContactPage = (fetched = true) => {
    const url = '/api/landing/v1/page/contact';
    const { data, isLoading, error } = useSWR(fetched ? url : null, fetcher, swrOptions);

    return useMemo(() => ({
        page: data?.data?.page ?? null,
        sections: data?.data?.sections ?? null,
        loading: isLoading,
        error,
    }), [data, isLoading, error]);
};

export const actionGetHomePage = async () => {
    const url = '/api/landing/v1/page/home';
    const res = await axiosInstance.get(url);
    return res;
};

export const actionGetAboutPage = async () => {
    const url = '/api/landing/v1/page/about';
    const res = await axiosInstance.get(url);
    return res;
};

export const actionGetContactPage = async () => {
    const url = '/api/landing/v1/page/contact';
    const res = await axiosInstance.get(url);
    return res;
};
