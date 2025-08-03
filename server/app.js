import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authrouter } from './routes/auth.routes.js';
import { storerouter } from './routes/store.routes.js';
import { userrouter } from './routes/user.routes.js';
import { adminrouter } from './routes/admin.routes.js';


const app = express();

app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials:true
    }
));
app.use(express.json());
app.use(cookieParser());


app.use('/api/v1/auth', authrouter);
app.use('/api/v1/user', userrouter);
app.use('/api/v1/store', storerouter);
app.use("/api/v1/admin",adminrouter)




export default app;