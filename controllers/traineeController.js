const db = require('../config/db');
const path = require('path');

// GET ALL TRAINEES
const getAllTrainees = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM trainees ORDER BY created_at DESC');
        res.json({ success: true, trainees: rows });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// GET SINGLE TRAINEE
const getTraineeById = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM trainees WHERE id = ?', [req.params.id]);
        if (!rows.length) return res.status(404).json({ success: false, message: 'Trainee not found.' });
        
        const [projects] = await db.execute('SELECT * FROM projects WHERE trainee_id = ?', [req.params.id]);
        const [feedback] = await db.execute('SELECT * FROM feedback WHERE trainee_id = ?', [req.params.id]);
        
        res.json({ success: true, trainee: rows[0], projects, feedback: feedback[0] || {} });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// CREATE TRAINEE
const createTrainee = async (req, res) => {
    try {
        const {
            name, email, mobile, college, course, branch,
            year_semester, from_date, to_date,
            training_officer, training_executive,
            certificate_issued, work_complete, projects
        } = req.body;

        if (!name || !email || !mobile || !college || !course || !branch || !year_semester || !from_date || !to_date) {
            return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
        }

        const report_file = req.files?.report_file?.[0]?.filename || null;
        const training_letter = req.files?.training_letter?.[0]?.filename || null;

        const [result] = await db.execute(
            `INSERT INTO trainees (name, email, mobile, college, course, branch, year_semester, from_date, to_date, training_officer, training_executive, certificate_issued, work_complete, report_file, training_letter)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, email, mobile, college, course, branch, year_semester, from_date, to_date,
             training_officer || null, training_executive || null,
             certificate_issued || 'No', work_complete || 'No',
             report_file, training_letter]
        );

        const traineeId = result.insertId;

        // Save projects
        if (projects) {
            const parsedProjects = JSON.parse(projects);
            for (let i = 0; i < parsedProjects.length; i++) {
                const p = parsedProjects[i];
                if (p.name) {
                    const projFile = req.files?.[`project_file_${i}`]?.[0]?.filename || null;
                    await db.execute(
                        'INSERT INTO projects (trainee_id, project_name, project_description, project_file) VALUES (?, ?, ?, ?)',
                        [traineeId, p.name, p.description || null, projFile]
                    );
                }
            }
        }

        res.json({ success: true, message: 'Trainee added successfully!', id: traineeId });
    } catch (err) {
        console.error('Error:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Email already exists.' });
        }
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// UPDATE TRAINEE
const updateTrainee = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name, email, mobile, college, course, branch,
            year_semester, from_date, to_date,
            training_officer, training_executive,
            certificate_issued, work_complete,
            officer_feedback, executive_feedback
        } = req.body;

        await db.execute(
            `UPDATE trainees SET name=?, email=?, mobile=?, college=?, course=?, branch=?, year_semester=?, from_date=?, to_date=?, training_officer=?, training_executive=?, certificate_issued=?, work_complete=? WHERE id=?`,
            [name, email, mobile, college, course, branch, year_semester, from_date, to_date,
             training_officer, training_executive, certificate_issued, work_complete, id]
        );

        // Update files if uploaded
        if (req.files?.report_file) {
            await db.execute('UPDATE trainees SET report_file=? WHERE id=?', [req.files.report_file[0].filename, id]);
        }
        if (req.files?.training_letter) {
            await db.execute('UPDATE trainees SET training_letter=? WHERE id=?', [req.files.training_letter[0].filename, id]);
        }
        if (req.files?.certificate_file) {
            await db.execute('UPDATE trainees SET certificate_file=? WHERE id=?', [req.files.certificate_file[0].filename, id]);
        }

        // Update feedback
        if (officer_feedback !== undefined || executive_feedback !== undefined) {
            const [existing] = await db.execute('SELECT id FROM feedback WHERE trainee_id=?', [id]);
            if (existing.length) {
                await db.execute(
                    'UPDATE feedback SET officer_feedback=?, executive_feedback=? WHERE trainee_id=?',
                    [officer_feedback, executive_feedback, id]
                );
            } else {
                await db.execute(
                    'INSERT INTO feedback (trainee_id, officer_feedback, executive_feedback) VALUES (?, ?, ?)',
                    [id, officer_feedback, executive_feedback]
                );
            }
        }

        res.json({ success: true, message: 'Trainee updated successfully!' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// DELETE TRAINEE
const deleteTrainee = async (req, res) => {
    try {
        await db.execute('DELETE FROM trainees WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Trainee deleted successfully!' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = { getAllTrainees, getTraineeById, createTrainee, updateTrainee, deleteTrainee };