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

describe("Book Creation validation Tests",()=>
{
    // Sample test data
    const dummyBook = {
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "genre": "Fiction",
        "bookImage": "https://example.com/book-covers/gatsby.jpg",
        "primaryColor": "red", 
        "bookDetails": "First edition, hardcover",
         "quantity":10,
        "bookSummary": "Set in the Jazz Age on Long Island, the novel depicts first-person narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan."
    };
        test('Book creation test',async()=>
        {
            
            const res=await apiClient.post(`/admin/addBook`,dummyBook);
            expect(res.status).toBe(201);
        })
        test('Missing author attribute test',async()=>
        {
            const data=dummyBook;
            delete data.author;
            const res=await apiClient.post(`/admin/addBook`,data);
            expect(res.status).toBe(400);

        })
        test('Missing title attribute test',async()=>
            {
                
                const data=dummyBook;
                delete data.title;
                const res=await apiClient.post(`/admin/addBook`,data);
                expect(res.status).toBe(400);
    
            })
        // test("Missing quantity test",async()=>
        // {
        //     const data =dummyBook;
        //     delete data.quantity;
        //     const res=await apiClient.post(`/admin/addBook`,data);
        //         expect(res.status).toBe(201);
        // })

        


})