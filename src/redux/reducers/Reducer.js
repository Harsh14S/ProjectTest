import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

const dateObj = new Date();
const currentTime = dateObj.getTime();
const currentDate = dateObj.getDate() + ' ' + dateObj.toLocaleString('default', { month: 'short' }) + ', ' + dateObj.getFullYear();

const storeDataToAsync = async (value) => {
    try {
        await AsyncStorage.setItem('@allCompanyData', JSON.stringify(value))
            .then(() => {
                // console.log("currentCompany is successfully set ");
            })
    } catch (e) {
        // saving error
        console.log('Error: ', e);
    }
}

const userSlice = createSlice({
    name: "company",
    initialState: {
        arr: ['sda', 'gdg', 'hyfrh'],
        companyArr: [],
        companyData: {
            'companyName': '',
            'dailyTaskData': [],
            'createdOn': '',
            'isPending': true,
        },
        dailyTaskData: {
            'dailyTaskName': '',
            'taskTitleData': [],
            'createdOn': '',
            'isPending': true,
        },
        taskTitleData: {
            'taskTitleName': '',
            'taskData': [],
            'createdOn': '',
            'isPending': true,
        },
        taskObj: {
            'taskName': '',
            'isPending': true,
        },

    },
    reducers: {
        setCompanyDataFromAsync: (state, action) => {
            if (state.companyArr.length === 0) {
                if (action.payload !== undefined) {
                    action.payload?.map(items => {
                        state.companyArr = [...state.companyArr, items];
                    })
                }
            } else {
                // console.log("setCompanyDataFromAsync is called inside else")
            }
        },

        createNewCompany: (state, action) => {
            function doesCompanyExists() {
                const index = state.companyArr.findIndex(ind => ind.companyName === action.payload)
                return index;
            }
            // console.log("Store Data: ", state.companyArr);
            const data = doesCompanyExists();
            if (data === -1) {
                const companyDataBin = {
                    ...state.companyData,
                    'companyName': action.payload,
                    'createdOn': dateObj.getTime(),
                }
                state.companyArr = [...state.companyArr, companyDataBin]
                // console.log("createNewCompany company state: ", state.companyArr);
                storeDataToAsync(state.companyArr)
            } else {
                console.log("Company already exists.....");
            }
        },

        addDailyTask: (state, action) => {
            console.log("Action Payload Data: ", action.payload);
            const currentCompanyIndex = state.companyArr.findIndex(ind => ind.companyName === action.payload.companyName);
            const currentCompanyData = state.companyArr[currentCompanyIndex];
            console.log("Current Company Data before: ", currentCompanyData);

            const currentDailyIndex = currentCompanyData.dailyTaskData.findIndex(ind => ind.dailyTaskName === action.payload.dailyTaskName);
            const currentDailyData = currentCompanyData.dailyTaskData.find(ind => ind.dailyTaskName === action.payload.dailyTaskName);
            console.log("Current Daily Index: ", currentDailyIndex);
            console.log("Current Daily Data: ", currentDailyData);

            if (currentDailyData === undefined) {
                const taskTitleArr = [];
                // console.log('Task Title Array: ', currentCompanyData)
                const dailyTaskObj = {
                    ...state.dailyTaskData,
                    'dailyTaskName': action.payload.dailyTaskName,
                    'taskTitleData': [...taskTitleArr, createTaskTitleObj()],
                    'createdOn': dateObj.getTime(),
                }
                currentCompanyData.dailyTaskData = [...currentCompanyData.dailyTaskData, dailyTaskObj];
            } else {

            }
            console.log("Current Company Data before: ", currentCompanyData);


            // const checkDailyTaskExists = currentCompanyData
            // const dailyTaskData = createDailyTaskTitleObj();
            // if (currentDailyIndex === -1) {
            //     console.log('first if')
            //     currentCompanyData.dailyTaskData = [...currentCompanyData.dailyTaskData, dailyTaskData];
            // } else {
            //     console.log('first else')
            //     const taskTitleArr = currentCompanyData.dailyTaskData[currentDailyIndex].taskTitleData;
            //     // console.log('Task Title Array: ', taskTitleArr)
            //     const dailyTaskObj = {
            //         ...state.dailyTaskData,
            //         'dailyTaskName': action.payload.dailyTaskName,
            //         'taskTitleData': [dailyTaskData],
            //         'createdOn': dateObj.getTime(),
            //     }
            //     // console.log('Daily Task Obj: ', dailyTaskObj)
            //     // return dailyTaskObj;
            //     currentCompanyData.dailyTaskData = [...currentCompanyData.dailyTaskData, dailyTaskObj];
            // }
            // // console.log("Current Company Data After: ", currentCompanyData);
            // function createDailyTaskTitleObj() {
            //     if (currentDailyIndex === -1) {
            //         console.log('second if')
            //         // const taskTitleArr = currentCompanyData.dailyTaskData[currentDailyIndex].taskTitleData;
            //         const taskTitleArr = [];
            //         // console.log('Task Title Array: ', currentCompanyData)
            //         const dailyTaskObj = {
            //             ...state.dailyTaskData,
            //             'dailyTaskName': action.payload.dailyTaskName,
            //             'taskTitleData': [...taskTitleArr, createTaskTitleObj()],
            //             'createdOn': dateObj.getTime(),
            //         }
            //         return dailyTaskObj;
            //     } else {
            //         console.log('second else')
            //         const taskTitleArr = currentCompanyData.dailyTaskData[currentDailyIndex].taskTitleData;
            //         // console.log('Task Title Array: ', taskTitleArr)
            //         const dailyTaskObj = {
            //             ...state.dailyTaskData,
            //             'dailyTaskName': action.payload.dailyTaskName,
            //             'taskTitleData': [...taskTitleArr, createTaskTitleObj()],
            //             'createdOn': dateObj.getTime(),
            //         }
            //         // console.log('Daily Task Obj: ', dailyTaskObj)
            //         return dailyTaskObj;
            //     }
            // }
            // function createTaskTitleObj() {
            //     const taskObjArr = []
            //     action.payload.taskData.map((item, index) => {
            //         const taskObj = {
            //             'taskName': item,
            //             'isPending': true,
            //         }
            //         taskObjArr.push(taskObj)
            //     })
            //     const taskTitleObj = {
            //         ...state.taskTitleData,
            //         'taskTitleName': action.payload.taskTitleName,
            //         'taskData': taskObjArr,
            //         'createdOn': dateObj.getTime(),
            //     }
            //     return taskTitleObj
            // }
            console.log("Current Company Data before: ", currentCompanyData);
            // storeDataToAsync(state.companyArr);
        }
    },
})

export const {
    createNewCompany, setCompanyDataFromAsync, addDailyTask
} = userSlice.actions
export default userSlice.reducer


