const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "Title is required"], // Added custom error message
    trim: true // Removes accidental spaces before/after the title
  },
  description: { 
    type: String,
    trim: true 
  },
  status: { 
    type: String, 
    enum: ["To Do", "In Progress", "Completed"], // Limits options to these three
    default: "To Do" 
  },
  assignedTo: { 
    type: String, 
    trim: true,
    default: "Unassigned"
  },
  deadline: { 
    type: Date 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true // Automatically adds 'createdAt' and 'updatedAt' fields
});

// Create and export the model
// 'Task' is the name of the collection in MongoDB (it will show up as 'tasks' in Compass)
module.exports = mongoose.model('Task', TaskSchema);