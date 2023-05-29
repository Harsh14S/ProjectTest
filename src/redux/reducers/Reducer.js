import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

const dateObj = new Date();
const currentTime = dateObj.getTime();
const currentDate = dateObj.getDate() + ' ' + dateObj.toLocaleString('default', { month: 'short' }) + ', ' + dateObj.getFullYear();

const storeDataToAsync = async (value) => {
    try {
        await AsyncStorage.setItem('@allCompanyData', JSON.stringify(value))
    } catch (e) {
        // saving error
        console.log('Error: ', e);
    }
}

const userSlice = createSlice({
    name: "company",
    initialState: {
        companyArr: [],
        allCompanyArr: [],
        currentCompanyArr: [],
        companyPendingArr: [],
        allCompanyPendingArr: [],
        currentCompanyPendingArr: [],
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
            // console.log('Current Task Title Index ', taskNameIndex, ' & Data : ', taskNameData);

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
            // console.log('taskNameDataAllStat: ', taskNameDataAllStat);
            if (taskNameDataAllStat) {
                // console.log('taskNameDataAllStat is Set to false')
                const taskNameObj = {
                    ...taskNameData,
                    'isPending': false
                }
                currentCompanyData.dailyTaskData[dailyTaskIndex].taskTitleData[taskNameIndex] = taskNameObj;
            } else {
                // console.log('taskNameDataAllStat is Set to true')
                const taskNameObj = {
                    ...taskNameData,
                    'isPending': true
                }
                currentCompanyData.dailyTaskData[dailyTaskIndex].taskTitleData[taskNameIndex] = taskNameObj;
            }
            // console.log('Current Task Title Index ', taskNameIndex, ' & Data : ', taskNameData);

            const dailyTaskDataAllStat = dailyTaskData.taskTitleData.every(crr => {
                // console.log("Crr ", crr);
                return crr.isPending === false
            }
            );
            // console.log('Current Daily Task Index ', dailyTaskIndex, ' & Data : ', dailyTaskData);
            // console.log('dailyTaskDataAllStat: ', dailyTaskDataAllStat)
            if (dailyTaskDataAllStat) {
                // console.log('dailyTaskDataAllStat is Set to false')
                const dailyTaskObj = {
                    ...dailyTaskData,
                    'isPending': false
                }
                currentCompanyData.dailyTaskData[dailyTaskIndex] = dailyTaskObj;
                // console.log(currentCompanyData.dailyTaskData[dailyTaskIndex])
            } else {
                // console.log('dailyTaskDataAllStat is Set to true')
                const dailyTaskObj = {
                    ...dailyTaskData,
                    'isPending': true
                }
                currentCompanyData.dailyTaskData[dailyTaskIndex] = dailyTaskObj;
            }

            const companyDataAllStat = currentCompanyData.dailyTaskData.every(crr => {
                // console.log("Crr ", crr);
                return crr.isPending === false
            }
            );
            // console.log('companyDataAllStat: ', companyDataAllStat)

            if (companyDataAllStat) {
                const companyObj = {
                    ...currentCompanyData,
                    'isPending': false
                }
                // console.log("companyObj: ", companyObj)
                state.companyArr[currentCompanyIndex] = companyObj;
            } else {
                // console.log('dailyTaskDataAllStat is Set to true')
                const companyObj = {
                    ...currentCompanyData,
                    'isPending': true
                }
                // console.log("companyObj: ", companyObj)
                state.companyArr[currentCompanyIndex] = companyObj;
            }

            // console.log('Current Daily Task Index ', currentCompanyIndex, ' & Data : ', state.companyArr[currentCompanyIndex]);
            storeDataToAsync(state.companyArr);
        },

        currentCompanyData: (state, action) => {
            // console.log('currentCompanyData action:', action.payload);
            const currentCompanyData = state.companyArr.filter(crr => crr.companyName === action.payload.companyName);
            // console.log('currentCompanyData: ', currentCompanyData);
            state.currentCompanyArr = currentCompanyData;
        },

        pendingCompanyData: (state, action) => {
            // console.log('pendingCompanyData action: ', action.payload)
            const allCompanyData = state.companyArr;
            // .find(crr => crr.companyName === action.payload.companyIndex);
            // console.log('Current Company: ', allCompanyData)
            const _pendingCompanyData = allCompanyData.filter(crr => crr.isPending === true);
            let pendingCompanyDataStore = []
            _pendingCompanyData.map((pendingCompItem, pendingCompIndex) => {
                // console.log('pendingCompanyData item: ', item);
                const pendingDailyTaskData = pendingCompItem.dailyTaskData.filter(crr => crr.isPending === true);
                // console.log('pendingDailyTaskData: ', pendingDailyTaskData)
                let pendingDailyTaskTitleStore = []
                pendingDailyTaskData.map((pendingDailyTaskItem, pendingDailyTaskIndex) => {
                    // console.log('pendingDailyTaskItem: ', pendingDailyTaskItem);
                    const pendingTaskTitleData = pendingDailyTaskItem.taskTitleData.filter(crr => crr.isPending === true);
                    // console.log('pendingTaskTitleData: ', pendingTaskTitleData);
                    let pendingTaskTitleStore = []
                    pendingTaskTitleData.map((pendingTaskTitItem, pendingTaskTitIndex) => {
                        // console.log('pendingTaskTitleData: ', pendingTaskTitItem);
                        const pendingTaskData = pendingTaskTitItem.taskData.filter(crr => crr.isPending === true);
                        // console.log('pendingTaskData: ', pendingTaskData)
                        pendingTaskTitleStore = [...pendingTaskTitleStore, { ...pendingTaskTitItem, 'taskData': pendingTaskData }]
                    })
                    // console.log('pendingTaskTitleStore of ', pendingDailyTaskItem.dailyTaskName, ': ', pendingTaskTitleStore)
                    pendingDailyTaskTitleStore = [...pendingDailyTaskTitleStore, { ...pendingDailyTaskItem, 'taskTitleData': pendingTaskTitleStore }]
                })
                // console.log('pendingDailyTaskTitleStore of ', pendingCompItem.companyName, ': ', JSON.stringify(pendingDailyTaskTitleStore))
                pendingCompanyDataStore = [...pendingCompanyDataStore, { ...pendingCompItem, 'dailyTaskData': pendingDailyTaskTitleStore }]
            })
            // console.log('pendingCompanyDataStore : ', JSON.stringify(pendingCompanyDataStore))
            state.companyPendingArr = pendingCompanyDataStore;



            //for current Company Data....
            const currentCompanyData = state.companyPendingArr.filter(crr => crr.companyName === action.payload.companyName);
            // console.log('currentCompanyData: ', JSON.stringify(currentCompanyData));
            state.currentCompanyPendingArr = currentCompanyData;
        },

        allCompanyData: (state, action) => {
            // console.log('allCompanyData state: ', state.companyArr);
            let allDates = [];
            state.companyArr.map((companyItem, companyIndex) => {
                // console.log('companyItem: ', companyItem)
                companyItem.dailyTaskData.map(item => {
                    // console.log('item: ', item.dailyTaskName)
                    allDates = [...allDates, item.dailyTaskName]
                });
                // console.log(dailyTaskTitleArr)
            })
            const uniqueArr = [...new Set(allDates)]
            // console.log('UniqueDates: ', uniqueArr)
            let emptyArr = []
            state.companyArr.map((companyItem, companyIndex) => {
                let dateArr = [];
                // console.log('companyItem: ', companyItem);
                companyItem.dailyTaskData.map(item => {
                    // console.log('dailyTaskItem: ', item)
                    const dateObj = {
                        'companyName': companyItem.companyName,
                        'dailyTaskName': item.dailyTaskName,
                        'companyData': item.taskTitleData,
                        'isPending': item.isPending,
                        'createdOn': item.createdOn,
                    }
                    dateArr = [...dateArr, dateObj]
                })
                // console.log('dateArr: ', JSON.stringify(dateArr));
                emptyArr = [...emptyArr, dateArr]
                // console.log(dailyTaskTitleArr)
            })
            // console.log('emptyArr: ', JSON.stringify(emptyArr.flat()));

            let finalData = [];
            uniqueArr.map(item => {
                // console.log('map item: ', item)
                const abcd = emptyArr.flat().filter(crr => crr.dailyTaskName === item);
                // console.log('abcd: ', abcd);
                let obj = {
                    // 'companyName': companyItem.companyName,
                    'dailyTaskName': item,
                    'companyData': abcd,
                    // 'isPending': item.isPending,
                    // 'createdOn': item.createdOn,
                };
                finalData = [...finalData, obj];
            })
            // console.log('finalData: ', JSON.stringify(finalData))
            state.allCompanyArr = finalData;
        },
        allCompanyPendingData: (state, action) => {
            // console.log('allCompanyData state: ', state.companyArr);
            let allDates = [];
            state.companyPendingArr.map((companyItem, companyIndex) => {
                // console.log('companyItem: ', companyItem)
                companyItem.dailyTaskData.map(item => {
                    // console.log('item: ', item.dailyTaskName)
                    allDates = [...allDates, item.dailyTaskName]
                });
                // console.log(dailyTaskTitleArr)
            })
            const uniqueArr = [...new Set(allDates)]
            // console.log('UniqueDates: ', uniqueArr)
            let emptyArr = []
            state.companyPendingArr.map((companyItem, companyIndex) => {
                let dateArr = [];
                // console.log('companyItem: ', companyItem);
                companyItem.dailyTaskData.map(item => {
                    // console.log('dailyTaskItem: ', item)
                    const dateObj = {
                        'companyName': companyItem.companyName,
                        'dailyTaskName': item.dailyTaskName,
                        'companyData': item.taskTitleData,
                        'isPending': item.isPending,
                        'createdOn': item.createdOn,
                    }
                    dateArr = [...dateArr, dateObj]
                })
                // console.log('dateArr: ', JSON.stringify(dateArr));
                emptyArr = [...emptyArr, dateArr]
                // console.log(dailyTaskTitleArr)
            })
            // console.log('emptyArr: ', JSON.stringify(emptyArr.flat()));

            let finalData = [];
            uniqueArr.map(item => {
                // console.log('map item: ', item)
                const abcd = emptyArr.flat().filter(crr => crr.dailyTaskName === item);
                // console.log('abcd: ', abcd);
                let obj = {
                    // 'companyName': companyItem.companyName,
                    'dailyTaskName': item,
                    'companyData': abcd,
                    // 'isPending': item.isPending,
                    // 'createdOn': item.createdOn,
                };
                finalData = [...finalData, obj];
            })
            // console.log('finalData: ', JSON.stringify(finalData))
            state.allCompanyPendingArr = finalData;
        }
    },
})

export const {
    createNewCompany, setCompanyDataFromAsync, addDailyTask, updatePendingStatus, pendingCompanyData, currentCompanyData, allCompanyData, allCompanyPendingData
} = userSlice.actions
export default userSlice.reducer


