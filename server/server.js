import dotenv from 'dotenv';
import app from './app.js';
import { startServer } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

startServer().then(()=>{
    app.listen(PORT,()=>{
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
    })
})
