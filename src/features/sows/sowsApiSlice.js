import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const sowsAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
});

const initialState = sowsAdapter.getInitialState();

export const sowsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getSoWs: builder.query({
            query: () => ({
                url: '/sows',
                
            }),
            transformResponse: responseData => {
                if (Array.isArray(responseData)) {
                    const loadedSoWs = responseData.map(sow => {
                        sow.id = sow._id;
                        return sow;
                    });
                    return sowsAdapter.setAll(initialState, loadedSoWs);
                } else {
                    // Log unexpected responses for debugging
                    console.error("Unexpected API response:", responseData);
                    return initialState;
                }
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'SoW', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'SoW', id }))
                    ]
                } else return [{ type: 'SoW', id: 'LIST' }]
            }
        }),
        addNewSoW: builder.mutation({
            query: initialSoW => ({
                url: '/sows',
                method: 'POST',
                body: {
                    ...initialSoW,
                }
            }),
            invalidatesTags: [
                { type: 'SoW', id: "LIST" }
            ]
        }),
        updateSoW: builder.mutation({
            query: initialSoW => ({
                url: '/sows',
                method: 'PATCH',
                body: {
                    ...initialSoW,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'SoW', id: arg.id }
            ]
        }),
        deleteSoW: builder.mutation({
            query: ({ id }) => ({
                url: `/sows`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'SoW', id: arg.id }
            ]
        }),
        
    }),
})

export const {
    useGetSoWsQuery,
    useAddNewSoWMutation,
    useUpdateSoWMutation,  
    useDeleteSoWMutation,
    // ... export other mutations
} = sowsApiSlice;

// Create selectors similar to your notes selectors
export const selectSoWsResult = sowsApiSlice.endpoints.getSoWs.select();
const selectSoWsData = createSelector(
    selectSoWsResult,
    sowsResult => sowsResult.data
);
export const {
    selectAll: selectAllSoWs,
    selectById: selectSoWById,
    selectIds: selectSoWIds
    // ... and so on
} = sowsAdapter.getSelectors(state => selectSoWsData(state) ?? initialState);