import express from 'express';
import database from './config/supabase.js';

const app = express();

app.use(express.json());

app.get('/todos', async (req, res) => {
    const { data, error } = await supabase
        .from('todos')
        .select();
    if (error) {
        return res.status(500).json({
            error: error.message
        });
    } else {
        return res.status(200).json({
            data
        });
    };
});

app.get('/todos/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('todos')
        .select()
        .eq('id', req.params.id);
    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }
    if (data.length === 0) {
        return res.status(404).json({
            error: "Task not found"
        });
    };
    res.status(200).json({
        data
        });
})

app.post('/todos', async (req, res) => {
    if (!req.body.task) {
        return res.status(400).json({
            error: "Task is required."
        });
    };
    if (typeof req.body.task !== 'string') {
        return res.status(400).json({
            error: "Task must be a text or a string."
        });
    };
    if (req.body.status === undefined) {
        return res.status(400).json({
            error: "Status is required."
        })
    };
    if (typeof req.body.status !== 'boolean') {
        return res.status(400).json({
            error: "Status must be boolean."
        })
    };
    const { data, error } = await supabase
        .from('todos')
        .insert({
            task: req.body.task,
            status: req.body.status
        })
        .select();
    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }
    res.status(201).json({
        message: "Added new task successfully.",
        data: data[0]
    });
});

app.patch('/todos/:id', async (req, res) => {
    if (req.body.task !== undefined) {
        if (typeof req.body.task !== 'string') {
        res.status(400).json({
            error: "Task must be a text or a string."
        })
    }};
    if (req.body.status !== undefined) {
        if (typeof req.body.status !== 'boolean') {
        res.status(400).json({
            error: "Status must be boolean."
        })
    }};
    if (req.body.task === undefined && req.body.status === undefined) {
        return res.status(400).json({
            error: "At least one field must be provided."
        })
    }
    const { data, error } = await supabase
        .from('todos')
        .update({
            task: req.body.task,
            status: req.body.status
        })
        .eq('id', req.params.id)
    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }
    if (data.length === 0) {
    return res.status(404).json({
        error: "Task not found"
    });
    }
    res.status(200).json({
        message: "Updated task successfully.",
        data: data[0]
    });
});

app.delete('/todos/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('todos')
        .delete()
        .eq('id', req.params.id)
    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }
    if (data.length === 0) {
    return res.status(404).json({
        error: "Task not found"
    });
    }
    res.status(200).json({
        message: "Deleted task successfully."
    });
})

app.get('/', (req, res) => {
    res.send('Welcome to Homepage');
})

app.listen(process.env.port, () => {
    console.log(`Server is running on port ${process.env.port}`);
});