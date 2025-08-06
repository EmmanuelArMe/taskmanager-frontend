import apiClient from './apiClient';

export interface LoginRequest {
    usernameOrEmail: string;
    password: string;
}

export interface SignupRequest {
    name: string;
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    tokenType: string;
    username: string;
}

const authService = {
    login: async (loginData: LoginRequest) => {
        const response = await apiClient.post<AuthResponse>('/auth/signin', loginData);
        localStorage.setItem('token', response.data.accessToken);
        return response.data;
    },

    signup: async (signupData: SignupRequest) => {
        return await apiClient.post('/auth/signup', signupData);
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    isAuthenticated: (): boolean => {
        return localStorage.getItem('token') !== null;
    }
};

export default authService;