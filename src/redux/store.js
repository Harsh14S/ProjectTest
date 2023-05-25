import { configureStore } from '@reduxjs/toolkit'
import companyReducer from '../redux/reducers/Reducer.js'

export const store = configureStore({
    reducer: {
        companyReducer,
    },
})
