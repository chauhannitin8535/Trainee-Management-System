const db = require('../config/db');

const saveFeedback = async (req, res) => {
    try {
        const { trainee_id, officer_feedback, executive_feedback } = req.body;

        if (!trainee_id) {
            return res.status(400).json({ success: false, message: 'Trainee ID required.' });
        }

        const [existing] = await db.execute('SELECT id FROM feedback WHERE trainee_id = ?', [trainee_id]);

        if (existing.length) {
            await db.execute(
                'UPDATE feedback SET officer_feedback = ?, executive_feedback = ? WHERE trainee_id = ?',
                [officer_feedback || null, executive_feedback || null, trainee_id]
            );
        } else {
            await db.execute(
                'INSERT INTO feedback (trainee_id, officer_feedback, executive_feedback) VALUES (?, ?, ?)',
                [trainee_id, officer_feedback || null, executive_feedback || null]
            );
        }

        res.json({ success: true, message: 'Feedback saved successfully!' });
    } catch (err) {
        console.error('Feedback error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const getFeedback = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM feedback WHERE trainee_id = ?', [req.params.id]);
        res.json({ success: true, feedback: rows[0] || {} });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = { saveFeedback, getFeedback };