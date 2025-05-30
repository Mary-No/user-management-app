import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type {BaseQueryFn, FetchArgs, FetchBaseQueryError,} from '@reduxjs/toolkit/query';
import {logout} from '../features/auth/authSlice';


const baseQuery = fetchBaseQuery({
    baseUrl: 'https://residential-dorette-mary-no-e96a3900.koyeb.app/api',
    prepareHeaders: (headers, {endpoint}) => {
        const endpointsRequiringAuth = ['getUsers', 'deleteUsers', 'blockUnblockUsers'];
        if (endpointsRequiringAuth.includes(endpoint)) {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
        }
        return headers;
    },
});

const baseQueryWithAuthHandling: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401 || result.error?.status === 403) {
        api.dispatch(logout());
    }

    return result;
};

export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithAuthHandling,
    endpoints: (build) => ({
        register: build.mutation<
            {
                user: {
                    id: number;
                    email: string;
                    password: string;
                    name: string;
                    lastLogin: string | null;
                    status: boolean;
                    createdAt: string;
                }
            },
            { email: string; password: string; name: string }
        >({
            query: (body) => ({
                url: '/auth/register',
                method: 'POST',
                body,
            }),
        }),
        login: build.mutation<
            { token: string },
            { email: string; password: string }
        >({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body,
            }),
        }),
        getUsers: build.query<
            Array<{
                id: number;
                email: string;
                name: string;
                status: boolean;
                lastLogin: string | null;
            }>,
            void
        >({
            query: () => '/users',
        }),
        blockUnblockUsers: build.mutation<
            { message: string },
            { userIds: number[]; status: boolean }
        >({
            query: (body) => ({
                url: '/users/block',
                method: 'POST',
                body,
            }),
        }),
        deleteUsers: build.mutation<
            { message: string },
            { userIds: number[] }
        >({
            query: (body) => ({
                url: '/users/delete',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useGetUsersQuery,
    useBlockUnblockUsersMutation,
    useDeleteUsersMutation
} = api;