// controllers/projectController.js
const db = require('../config/db');

// GET /api/projects/:trainee_id
const getProjectsByTrainee = async (req, res) => {
    try {
        const { trainee_id } = req.params;
        const [rows] = await db.execute(
            'SELECT * FROM projects WHERE trainee_id = ? ORDER BY project_number',
            [trainee_id]
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// POST /api/projects - Add project
const addProject = async (req, res) => {
    try {
        const { trainee_id, project_number, project_name, description } = req.body;
        const file_path = req.file ? req.file.filename : null;

        if (!trainee_id || !project_name) {
            return res.status(400).json({ success: false, message: 'Trainee ID and project name are required.' });
        }

        const [result] = await db.execute(
            'INSERT INTO projects (trainee_id, project_number, project_name, description, file_path) VALUES (?, ?, ?, ?, ?)',
            [trainee_id, project_number || 1, project_name, description || null, file_path]
        );

        res.status(201).json({ success: true, message: 'Project added!', project_id: result.insertId });
    } catch (err) {
        console.error('Add project error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// PUT /api/projects/:id - Update project
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { project_name, description } = req.body;
        const file_path = req.file ? req.file.filename : null;

        let query = 'UPDATE projects SET project_name=?, description=?';
        let values = [project_name, description];

        if (file_path) { query += ', file_path=?'; values.push(file_path); }
        query += ' WHERE id=?';
        values.push(id);

        await db.execute(query, values);
        res.json({ success: true, message: 'Project updated!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM projects WHERE id = ?', [id]);
        res.json({ success: true, message: 'Project deleted.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = { getProjectsByTrainee, addProject, updateProject, deleteProject };