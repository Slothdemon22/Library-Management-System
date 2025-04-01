const axios = require('axios');


const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 10000,
    validateStatus: function (status) {
        return status < 500; 
    }
});

describe('User Endpoint Tests', () => {
    let userEmail;
    let userPassword;
    //let authToken;

    test("Register User Test", async () => {
        userEmail = `www.basil${Math.floor(Math.random() * 10000)}@gmail.com`;
        userPassword = '12345678';
        
        const res = await apiClient.post('/auth/register', {
            fullName: "basil",
            email: userEmail,
            password: userPassword
        });
        
        expect(res.status).toBe(201);
    });

    test("Login Test", async () => {
        const res = await apiClient.post('/auth/login', { email: userEmail, password: userPassword });
    
        expect(res.status).toBe(200);
        //expect(res.data).toHaveProperty("token");
        
       // authToken = res.data.token;
    });

    test("Logout Test", async () => {
        const res = await apiClient.post('/auth/logout', {}, {
           
        });
        
        expect(res.status).toBe(200);
        //expect(res.data).toHaveProperty("message");
    });

    // Error Tests
    test("Register User - Missing Fields", async () => {
        const res = await apiClient.post('/auth/register', { email: "test@example.com" });
        expect(res.status).toBe(400);
        expect(res.data).toHaveProperty("error");
    });

    test("Register User - Invalid Email", async () => {
        const res = await apiClient.post('/auth/register', {
            fullName: "Invalid Email",
            email: "invalid-email",
            password: "password123"
        });
        expect(res.status).toBe(400);
        expect(res.data).toHaveProperty("error");
    });

    test("Login - Wrong Password", async () => {
        const res = await apiClient.post('/auth/login', { email: userEmail, password: "wrongpassword" });
        expect(res.status).toBe(401);
    });

    test("Login - Unregistered User", async () => {
        const res = await apiClient.post('/auth/login', { email: "fakeuser@example.com", password: "password123" });
        expect(res.status).toBe(401);
    });

    // test("Protected Route - No Token", async () => {
    //     const res = await apiClient.get('/auth/protected');
    //     expect(res.status).toBe(401);
    // });

    // test("Protected Route - Invalid Token", async () => {
    //     const res = await apiClient.get('/auth/protected', {
    //         headers: { Authorization: `Bearer invalidtoken123` }
    //     });
    //     expect(res.status).toBe(401);
    // });
});
