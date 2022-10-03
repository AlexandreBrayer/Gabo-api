declare module 'cors';
interface RegisterPayload {
    name?: string;
    password?: string;
    email?: string;
}

interface LoginPayload {
    name?: string;
    password?: string;
}
