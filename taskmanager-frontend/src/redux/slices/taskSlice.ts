import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import taskService, { Task } from '../../api/taskService';

interface TaskState {
    tasks: Task[];
    selectedTask: Task | null;
    loading: boolean;
    error: string | null;
}

const initialState: TaskState = {
    tasks: [],
    selectedTask: null,
    loading: false,
    error: null
};

export const fetchTasks = createAsyncThunk(
    'tasks/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await taskService.getAllTasks();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al cargar tareas');
        }
    }
);

export const fetchTaskById = createAsyncThunk(
    'tasks/fetchById',
    async (taskId: number, { rejectWithValue }) => {
        try {
            return await taskService.getTaskById(taskId);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al cargar la tarea');
        }
    }
);

export const createTask = createAsyncThunk(
    'tasks/create',
    async (task: Task, { rejectWithValue }) => {
        try {
            return await taskService.createTask(task);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al crear la tarea');
        }
    }
);

export const updateTask = createAsyncThunk(
    'tasks/update',
    async ({ id, task }: { id: number; task: Task }, { rejectWithValue }) => {
        try {
            return await taskService.updateTask(id, task);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al actualizar la tarea');
        }
    }
);

export const updateTaskStatus = createAsyncThunk(
    'tasks/updateStatus',
    async ({ id, status }: { id: number; status: Task['status'] }, { rejectWithValue }) => {
        try {
            return await taskService.updateTaskStatus(id, status);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al actualizar el estado');
        }
    }
);

export const deleteTask = createAsyncThunk(
    'tasks/delete',
    async (taskId: number, { rejectWithValue }) => {
        try {
            await taskService.deleteTask(taskId);
            return taskId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al eliminar la tarea');
        }
    }
);

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setSelectedTask: (state, action: PayloadAction<Task | null>) => {
            state.selectedTask = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchTaskById.fulfilled, (state, action: PayloadAction<Task>) => {
                state.selectedTask = action.payload;
            })
            .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
                state.tasks.push(action.payload);
            })
            .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
                const index = state.tasks.findIndex(task => task.id === action.payload.id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
            })
            .addCase(updateTaskStatus.fulfilled, (state, action: PayloadAction<Task>) => {
                const index = state.tasks.findIndex(task => task.id === action.payload.id);
                if (index !== -1) {
                    state.tasks[index].status = action.payload.status;
                }
            })
            .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
                state.tasks = state.tasks.filter(task => task.id !== action.payload);
            });
    }
});

export const { setSelectedTask, clearError } = taskSlice.actions;
export default taskSlice.reducer;