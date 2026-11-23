import axios from "../lib/axios";
import {USER_INFO_KEY, USER_ROLES_KEY, USER_BRANCHES_KEY, USER_PERMISSION_CODES_KEY} from "../auth/context/authorize";

export const getCsrfSession = async () => {
    const res = await axios.get('/sanctum/csrf-cookie');
}

export const getAuthUser = () => {
    if (typeof window === 'undefined') return null

    const userEncoded = localStorage.getItem(USER_INFO_KEY)
    try {
        let user = JSON.parse(userEncoded)
        return user
    } catch (e) {
        console.error('[auth@getAuthUser] cant decoded user', userEncoded)
    }

}

export const getUserRoles = () => {
    const userRolesEncoded = localStorage.getItem(USER_ROLES_KEY)
    try {
        let user = JSON.parse(userRolesEncoded)
        return user
    } catch (e) {
        console.error('[auth@getUserRoles] cant decoded user', userRolesEncoded)
    }

}

export const getPermissionCodes = () => {
    const encoded = localStorage.getItem(USER_PERMISSION_CODES_KEY)
    try {
        let user = JSON.parse(encoded)
        return user
    } catch (e) {
        console.error('[auth@getPermissionCodes] cant decoded USER_PERMISSION_CODES_KEY', encoded)
    }
}

export const getBranches = () => {
    const encoded = localStorage.getItem(USER_BRANCHES_KEY)
    try {
        let user = JSON.parse(encoded)
        return user
    } catch (e) {
        console.error('[auth@getBranches] cant decoded USER_BRANCHES_KEY', encoded)
    }
}
