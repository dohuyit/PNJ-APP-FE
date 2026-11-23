// Media library — /api/v1/commerce/media/* + upload /api/v1/file/upload
import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher } from 'src/lib/axios';

const swrOptions = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export const CONST_MEDIA_KIND = [
    { id: 'image', label: 'Ảnh' },
    { id: 'video', label: 'Video' },
    { id: 'document', label: 'Tài liệu' },
];

export const useGetMediaList = (params = {}, fetched = true) => {
    const queryString = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    let url = '/api/v1/commerce/media/list';
    if (queryString) {
        url += '?' + queryString;
    }

    const { data, isLoading, error, isValidating } = useSWR(fetched ? url : null, fetcher, {
        ...swrOptions,
        keepPreviousData: true,
    });

    return useMemo(() => ({
        searchResults: data?.data?.items || [],
        searchLoading: isLoading || isValidating,
        searchError: error,
        searchValidating: isValidating,
        searchEmpty: !isLoading && !isValidating && !data?.data?.items?.length,
        metaPage: data?.data?.meta?.page ?? 1,
        metaPerPage: data?.data?.meta?.perPage ?? 20,
        metaTotal: data?.data?.meta?.total ?? 0,
        metaTotalPage: data?.data?.meta?.totalPage ?? 0,
    }), [data, isLoading, isValidating, error]);
};

export const useGetMediaFolders = (fetched = true) => {
    const url = '/api/v1/commerce/media/folders';
    const { data, isLoading, error, isValidating } = useSWR(fetched ? url : null, fetcher, swrOptions);

    return useMemo(() => ({
        folders: data?.data?.items || data?.data || [],
        foldersLoading: isLoading || isValidating,
        foldersError: error,
    }), [data, isLoading, isValidating, error]);
};

export const refreshMediaList = async () => {
    const prefix = '/api/v1/commerce/media/list';
    await mutate(
        (key) => typeof key === 'string' && key.startsWith(prefix),
        undefined,
        { revalidate: true }
    );
};

export const actionDeleteMedia = async (_id) => {
    const url = `/api/v1/commerce/media/${_id}/delete`;
    const res = await axiosInstance.post(url);
    return res;
};

/** Upload file (multipart/form-data). FormData: file, source, folder */
export const actionUploadFile = async (file, { source = 'media', folder = 'uploads' } = {}) => {
    const form = new FormData();
    form.append('file', file);
    form.append('source', source);
    form.append('folder', folder);
    const url = '/api/v1/file/upload';
    const res = await axiosInstance.post(url, form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res;
};
