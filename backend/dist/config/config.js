import 'dotenv/config';
const config = {
    user: process.env.USERID, // Your Azure SQL username
    password: process.env.PASSWORD, // Your Azure SQL password
    server: process.env.SERVER, // Your Azure SQL Server
    database: process.env.DATABASE, // Your Database Name
    options: {
        encrypt: true, // Required for Azure
        trustServerCertificate: false, // Set to true if using self-signed certificates
    },
};
export default config;
