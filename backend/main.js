import express from 'express';
import supabase from './config/supabase.js';
import todoRoutes from './routes/todoRoutes.js';

const app = express();

app.use(express.json());

app.use('/todos', todoRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to Homepage');
});

app.listen(process.env.port, () => {
    console.log(`Server is running on port ${process.env.port}`);
});