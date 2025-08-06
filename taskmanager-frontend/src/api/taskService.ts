import apiClient from './apiClient';

export interface Task {
    id?: number;
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    dueDate: string;
    status: 'PENDING' | 'TODO' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED' | 'CANCELLED';
    assignedUser?: number; // Use number if assignedUser is a user ID, or define a User interface if it's a user object
}

const taskService = {
    getAllTasks: async () => {
        const response = await apiClient.get<Task[]>('/tasks');
        return response.data;
    },

    getTaskById: async (id: number) => {
        const response = await apiClient.get<Task>(`/tasks/${id}`);
        return response.data;
    },

    createTask: async (task: Task) => {
        const response = await apiClient.post<Task>('/tasks', task);
        return response.data;
    },

    updateTask: async (id: number, task: Task) => {
        const response = await apiClient.put<Task>(`/tasks/${id}`, task);
        return response.data;
    },

    updateTaskStatus: async (id: number, status: Task['status']) => {
        const response = await apiClient.patch<Task>(`/tasks/${id}/status`, { status });
        return response.data;
    },

    deleteTask: async (id: number) => {
        return await apiClient.delete(`/tasks/${id}`);
    }
};

export default taskService;