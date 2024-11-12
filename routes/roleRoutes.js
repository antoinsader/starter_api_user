const express = require('express');
const ctrl= require('../controllers/roleController');

const { auth_admin, auth_customer} = require('../middlewares/auth');
const role = require('../middlewares/role');

const router = express.Router();

router.get('/admin/getAll', auth_admin,role('ADMIN'), ctrl.getAll);
router.post('/admin/create', auth_admin, role('ADMIN'), ctrl.create);
router.post('/admin/update', auth_admin, role('ADMIN'), ctrl.update);
router.delete('/admin/delete', auth_admin, role('ADMIN'), ctrl.deleteOne);

module.exports = router;
