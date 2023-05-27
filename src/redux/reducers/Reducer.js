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
            const currentCompanyIndex = state.companyArr.findIndex(ind => ind.companyName === action.payload.companyName);
            const currentCompanyData = state.companyArr[currentCompanyIndex];

            const currentDailyIndex = currentCompanyData.dailyTaskData.findIndex(ind => ind.dailyTaskName === action.payload.dailyTaskName);
            const currentDailyData = currentCompanyData.dailyTaskData.find(ind => ind.dailyTaskName === action.payload.dailyTaskName);

            if (currentDailyData === undefined) {
                // checks if the daily task is new
                const taskTitleArr = [];
                const dailyTaskObj = {
                    ...state.dailyTaskData,
                    'dailyTaskName': action.payload.dailyTaskName,
                    'taskTitleData': [...taskTitleArr, createTaskTitleObj()],
                    'createdOn': dateObj.getTime(),
                }
                currentCompanyData.dailyTaskData = [...currentCompanyData.dailyTaskData, dailyTaskObj];
            } else {
                // updates the currently daily task title
                const taskTitleArr = currentDailyData.taskTitleData;
                const dailyTaskObj = {
                    ...state.dailyTaskData,
                    'dailyTaskName': action.payload.dailyTaskName,
                    'taskTitleData': [...taskTitleArr, createTaskTitleObj()],
                    'createdOn': dateObj.getTime(),
                }
                currentCompanyData.dailyTaskData[currentDailyIndex] = dailyTaskObj;
            }

            function createTaskTitleObj() {
                const taskObjArr = []
                action.payload.taskData.map((item, index) => {
                    const taskObj = {
                        'taskName': item,
                        'isPending': true,
                    }
                    taskObjArr.push(taskObj)
                })
                const taskTitleObj = {
                    ...state.taskTitleData,
                    'taskTitleName': action.payload.taskTitleName,
                    'taskData': taskObjArr,
                    'createdOn': dateObj.getTime(),
                }
                // console.log('taskTitleObj: ', taskTitleObj);
                // console.log('time: ', dateObj.getTime());
                return taskTitleObj
            }
            storeDataToAsync(state.companyArr);
        },

        updatePendingStatus: (state, action) => {
            // console.log('updatePendingStatus action data: ', action.payload);
            const currentCompanyData = state.companyArr.find(crr => crr.companyName === action.payload.companyName);
            const currentCompanyIndex = state.companyArr.findIndex(crr => crr.companyName === action.payload.companyName);
            // console.log('Current Company Index ', currentCompanyIndex, ' & Data : ', currentCompanyData);

            const dailyTaskData = currentCompanyData.dailyTaskData.find(crr => crr.dailyTaskName === action.payload.dailyTaskName);
            const dailyTaskIndex = currentCompanyData.dailyTaskData.findIndex(crr => crr.dailyTaskName === action.payload.dailyTaskName);
            // console.log('Current Daily Task Index ', dailyTaskIndex, ' & Data : ', dailyTaskData);

            const taskNameData = dailyTaskData.taskTitleData.find(crr => crr.taskTitleName === action.payload.taskTitleName);
            const taskNameIndex = dailyTaskData.taskTitleData.findIndex(crr => crr.taskTitleName === action.payload.taskTitleName);
            console.log('Current Task Title Index ', taskNameIndex, ' & Data : ', taskNameData);

            const taskData = taskNameData.taskData.find(crr => crr.taskName === action.payload.taskName);
            const taskIndex = taskNameData.taskData.findIndex(crr => crr.taskName === action.payload.taskName);
            // console.log('Current Task Index ', taskIndex, ' & Data : ', taskData);

            const obj = {
                ...taskData,
                'isPending': !(taskData.isPending)
            }
            // console.log('Previous Obj: ', currentCompanyData.dailyTaskData[dailyTaskIndex].taskTitleData[taskNameIndex].taskData[taskIndex])
            currentCompanyData.dailyTaskData[dailyTaskIndex].taskTitleData[taskNameIndex].taskData[taskIndex] = obj;
            // console.log('Return Obj: ', currentCompanyData.dailyTaskData[dailyTaskIndex].taskTitleData[taskNameIndex].taskData[taskIndex]);

            const taskNameDataAllStat = taskNameData.taskData.every(crr => crr.isPending === false);
            console.log('taskNameDataAllStat: ', taskNameDataAllStat);
            // if (taskNameDataAllStat) {
            //     const taskNameObj = {
            //         ...taskNameData,
            //         'isPending': !(taskNameData.isPending)
            //     }
            //     currentCompanyData.dailyTaskData[dailyTaskIndex].taskTitleData[taskNameIndex] = taskNameObj;
            // } else {
            //     const taskNameObj = {
            //         ...taskNameData,
            //         'isPending': !(taskNameData.isPending)
            //     }
            //     currentCompanyData.dailyTaskData[dailyTaskIndex].taskTitleData[taskNameIndex] = taskNameObj;
            // }
            console.log('Current Task Title Index ', taskNameIndex, ' & Data : ', taskNameData);

            const dailyTaskDataAllStat = dailyTaskData.taskTitleData.every(crr => {
                // console.log("Crr ", crr);
                return crr.isPending === false
            }
            );
            // console.log('Current Daily Task Index ', dailyTaskIndex, ' & Data : ', dailyTaskData);
            // console.log('dailyTaskDataAllStat: ', dailyTaskDataAllStat)
            // if (dailyTaskDataAllStat) {
            //     const dailyTaskObj = {
            //         ...dailyTaskData,
            //         'isPending': !(dailyTaskData.isPending)
            //     }
            //     currentCompanyData.dailyTaskData[dailyTaskIndex] = dailyTaskObj;
            //     // console.log(currentCompanyData.dailyTaskData[dailyTaskIndex])
            // } else {
            //     const dailyTaskObj = {
            //         ...dailyTaskData,
            //         'isPending': !(dailyTaskData.isPending)
            //     }
            //     currentCompanyData.dailyTaskData[dailyTaskIndex] = dailyTaskObj;
            // }

            storeDataToAsync(state.companyArr);
        }
    },
})

export const {
    createNewCompany, setCompanyDataFromAsync, addDailyTask, updatePendingStatus
} = userSlice.actions
export default userSlice.reducer


