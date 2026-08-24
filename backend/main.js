import express from 'express';
import env from 'dotenv';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';

env.config();

const app = express();

const supabase = createClient(process.env.supabaseURL, process.env.supabaseAPI);

app.use(bodyParser.json());

app.get('/todos', async (req, res) => {
    const { data, error } = await supabase
        .from('todos')
        .select();
    if (error) {
        res.status(400).json({
            error: "Bad Request"
        });
    } else {
        res.status(200).json({
            data
        });
    };
});

app.get('/todos/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('todos')
        .select()
        .eq('id', req.params.id);
    if (data.length === 0) {
        res.status(404).json({
            error: "Task not found"
        });
    } else {
        res.status(200).json({
            data
        });
    };
})

app.post('/todos', async (req, res) => {
    const { data, error } = await supabase
        .from('todos')
        .insert({
            task: req.body.task,
            status: req.body.status
        })
        .select();
    if (!req.body.task) {
        res.status(400).json({
            error: "Task is required."
        });
    };
    if (typeof req.body.task !== 'string') {
        res.status(406).json({
            error: "Task must be a text or a string."
        });
    };
    if (req.body.status === undefined) {
        res.status(400).json({
            error: "Status is required."
        })
    };
    if (typeof req.body.status !== 'boolean') {
        res.status(406).json({
            error: "Status must be boolean."
        })
    } else {
        res.status(201).send(`New Task with ID#${data[0].id} had been added containing ${data[0].task} with status ${data[0].status}.`);
    };
});

app.patch('/todos/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('todos')
        .update({
            task: req.body.task,
            status: req.body.status
        })
        .eq('id', req.params.id)
    if (req.body.task !== undefined) {
        if (typeof req.body.task !== 'string') {
        res.status(406).json({
            error: "Task must be a text or a string."
        })
    }};
    if (req.body.status !== undefined) {
        if (typeof req.body.status !== 'boolean') {
        res.status(406).json({
            error: "Status must be boolean."
        })
    }
    
    } else {
        res.send(`Task with ID #${req.params.id} has been updated.`);
    };
});

app.delete('/todos/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('todos')
        .delete()
        .eq('id', req.params.id)
    if (error) {
        res.send(error);
    } else {
        res.send(`Task #${req.params.id} has been successfully removed`);
    };
})

app.get('/', (req, res) => {
    res.send('Welcome to Homepage');
})

app.listen(process.env.port, () => {
    console.log(`Server is running on port ${process.env.port}`);
});