import express from 'express';
import supabase from '../config/supabase.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('todos')
        .select();
    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }
    res.status(200).json({
        data
        });
});

router.get('/:id', async (req, res) => {
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

router.post('/', async (req, res) => {
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

router.patch('/:id', async (req, res) => {
    const updates = {};
    if (req.body.task !== undefined) {
        if (typeof req.body.task !== 'string') {
            return res.status(400).json({
                error: "Task must be a text or a string."
        })}
        updates.task = req.body.task;
    };
    if (req.body.status !== undefined) {
        if (typeof req.body.status !== 'boolean') {
            return res.status(400).json({
                error: "Status must be boolean."
        })}
        updates.status = req.body.status;
    };
    if (req.body.task === undefined && req.body.status === undefined) {
        return res.status(400).json({
            error: "At least one field must be provided."
        })
    }
    const { data, error } = await supabase
        .from('todos')
        .update(updates)
        .eq('id', req.params.id)
        .select();
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

router.delete('/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('todos')
        .delete()
        .eq('id', req.params.id)
        .select();
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

export default router;