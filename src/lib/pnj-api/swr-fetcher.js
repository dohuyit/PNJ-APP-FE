// src/lib/pnj-api/swr-fetcher.js — SWR default fetcher using axios-admin
import { axiosAdmin } from './axios-admin';

export const adminFetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosAdmin.get(url, config);
  return res.data;
};
