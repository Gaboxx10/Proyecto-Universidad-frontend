export class ApiRoutes {
    
    private baseUrl = 'http://localhost:3000/api';

    auth = {
        login: `${this.baseUrl}/auth/login`,
        logout: `${this.baseUrl}/auth/logout`,
    }	

    dashboard = {
        get: `${this.baseUrl}/dashboard`,
    }

    user = {
        get: `${this.baseUrl}/ususario/users`,
        update: `${this.baseUrl}/user`,
    }
}