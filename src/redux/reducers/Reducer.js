import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

const dateObj = new Date();
const currentTime = dateObj.getTime();
const currentDate = dateObj.getDate() + ' ' + dateObj.toLocaleString('default', { month: 'short' }) + ', ' + dateObj.getFullYear();

const storeDataToAsync = async (value) => {
    try {
        await AsyncStorage.setItem('@allCompanyData', JSON.stringify(value))
            .then(() => {
                console.log("currentCompany is successfully set ");
            })
    } catch (e) {
        // saving error
        console.log('Error: ', e);
    }
}

const userSlice = createSlice({
    name: "company",
    initialState: {
        company: [],
        companyData: {
            'companyName': '',
            'dailyTaskData': '',
            'createdOn': '',
            'isPending': true,
        },
        dailyTask: [],
        dailyTaskData: {
            'dailyTaskName': '',
            'taskTitleData': '',
            'createdOn': '',
            'isPending': true,
        },
        taskTitle: [],
        taskTitleData: {
            'taskTitleName': '',
            'tasksData': '',
            'createdOn': '',
            'isPending': true,
        },
        tasks: [],
        tasksData: {
            'tasksName': '',
            'isPending': true,
        },

    },
    reducers: {
        initialData: (state, action) => {
            // if (state.company === []) {
            // console.log("Payload Items: ", state.company)
            action.payload.map(item => {
                // console.log("Payload Items: ", item)
                state.company = [...state.company, item]
            })
            // }
        },
        createNewCompany: (state, action) => {
            function companyExists(companyName) {
                return state.company.some(function (rec) {
                    return rec.companyName === companyName;
                });
            }

            if (companyExists(action.payload)) {
                console.log("Alredy Exists......")
            } else {
                state.companyData = {
                    ...state.companyData,
                    'companyName': action.payload,
                    'taskCreatedOn': new Date().getTime(),
                    // 'isCompleted': false,
                }
                // console.log("Company Data: ", state.companyData);
                state.company = [...state.company, state.companyData];
            }
            storeDataToAsync(state.company);
            // console.log("Create Company Reducer state: ", state.company);
        },
        addCompanyData: (state, action) => {
            // state.company.filter(action.payload === )

            function companyExists(companyName) {
                const result = state.company.findIndex((cur) => cur.companyName === companyName)
                // console.log("Result: ", result);
                return result;
            }
            // console.log(companyExists(action.payload))
            state.company[companyExists(action.payload)] = {
                ...state.companyData,
                'companyName': action.payload,
                'dailyTaskData': state.dailyTask,
            }
            // if (companyExists(action.payload)) {

            // }
            // state.companyData = {
            //     ...state.companyData,
            //     'companyName': action.payload,
            //     'dailyTaskData': state.dailyTask,
            // }
            // state.company = [...state.company, state.companyData];
            storeDataToAsync(state.company);
        },

        addNewDailyTaskTitle: (state, action) => {
            function dailyTaskExists(dailyTaskName) {
                return state.dailyTask.some(function (rec) {
                    return rec.dailyTaskName === dailyTaskName;
                });
            }
            if (dailyTaskExists(action.payload)) {
                console.log("daily Task Alredy Exists......")
            } else {
                state.dailyTaskData = {
                    ...state.dailyTaskData,
                    'dailyTaskName': action.payload,
                    'taskTitleData': state.taskTitle,
                    'createdOn': new Date().getTime(),

                }
                state.dailyTask = [...state.dailyTask, state.dailyTaskData];
            }
            console.log("Daily Tasks Reducer state: ", state.dailyTask);
        },

        addNewTaskTitle: (state, action) => {
            function taskTitleExists(taskTitleName) {
                return state.taskTitle.some(function (rec) {
                    return rec.taskTitleName === taskTitleName;
                });
            }
            if (taskTitleExists(action.payload)) {
                console.log("Task Alredy Exists......")
            } else {
                state.taskTitleData = {
                    ...state.taskTitleData,
                    'taskTitleName': action.payload,
                    'tasksData': state.tasks,
                    'createdOn': new Date().getTime(),
                }
                state.taskTitle = [...state.taskTitle, state.taskTitleData];
            }
            console.log("Task Title Reducer state: ", JSON.stringify(state.taskTitle));
        },

        addNewTask: (state, action) => {
            function taskExists(tasksName) {
                return state.tasks.some(function (rec) {
                    return rec.tasksName === tasksName;
                });
            }
            if (taskExists(action.payload)) {
                console.log("Task Alredy Exists......")
            } else {
                state.tasksData = {
                    ...state.tasksData,
                    'tasksName': action.payload,
                }
                state.tasks = [...state.tasks, state.tasksData];
            }
        },
    },
})

export const { initialData, createNewCompany, addCompanyData, addNewDailyTaskTitle, addNewTaskTitle, addNewTask } = userSlice.actions
export default userSlice.reducer


