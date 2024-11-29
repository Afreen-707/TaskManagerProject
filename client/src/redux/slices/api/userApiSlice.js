import apiSlice from "../apiSlice";

const USER_URL= "/user"

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateUser: builder.mutation({
            query:(data) => ({
                url: `${USER_URL}/profile`,
                method: "PUT",
                body: data,
                credentials: "include",
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/register`,
                method: "POST",
                body: data,
                credentials: "include",
            }),
        }),
        getTeamList: builder.query({
            query: (data)=>({
                url: `${USER_URL}/get-team`,
                method: "GET",
                credentials: "include",
            }),
        }),
    }),
});

export const {useUpdateUserMutation,
    useRegisterMutation,
    useGetTeamListQuery
} = usersApiSlice;

