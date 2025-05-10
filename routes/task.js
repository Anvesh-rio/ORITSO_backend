const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

router.post('/task', async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;

    const task = new Task({
      title,
      description,
      dueDate,
      status,
    });

    await task.save();

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
    });
  }
});

router.get('/task', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Tasks fetched successfully',
      data: tasks,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
    });
  }
});

router.put('/task/:id', async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;
    const id = req.params.id;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, dueDate, status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
    });
  }
});

router.delete('/task/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
    });
  }
});

router.get('/task/search', async (req, res) => {
  try {
    const keyword = req.query.q || '';

    const tasks = await Task.find({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ],
    });

    return res.status(200).json({
      success: true,
      message: 'Search completed successfully',
      data: tasks,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
    });
  }
});

module.exports = router;
