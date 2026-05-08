const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const {
    getAllTrainees,
    getTraineeById,
    createTrainee,
    updateTrainee,
    deleteTrainee
} = require('../controllers/traineeController');

router.get('/', getAllTrainees);
router.get('/:id', getTraineeById);

router.post('/', upload.fields([
    { name: 'report_file', maxCount: 1 },
    { name: 'training_letter', maxCount: 1 },
    { name: 'project_file_0', maxCount: 1 },
    { name: 'project_file_1', maxCount: 1 },
    { name: 'project_file_2', maxCount: 1 },
    { name: 'project_file_3', maxCount: 1 },
    { name: 'project_file_4', maxCount: 1 }
]), createTrainee);

router.put('/:id', upload.fields([
    { name: 'report_file', maxCount: 1 },
    { name: 'training_letter', maxCount: 1 },
    { name: 'certificate_file', maxCount: 1 }
]), updateTrainee);

router.delete('/:id', deleteTrainee);

module.exports = router;