// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { isLoggedIn } = require('../middleware/auth');
const { getProjectsByTrainee, addProject, updateProject, deleteProject } = require('../controllers/projectController');

router.use(isLoggedIn);

router.get('/:trainee_id', getProjectsByTrainee);
router.post('/', upload.single('project_file'), addProject);
router.put('/:id', upload.single('project_file'), updateProject);
router.delete('/:id', deleteProject);

module.exports = router;