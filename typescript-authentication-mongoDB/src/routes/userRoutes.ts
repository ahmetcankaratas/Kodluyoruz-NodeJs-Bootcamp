import express from 'express';
import autControl from '../middleware/autControl';
import controller from '../controllers/userControllers';

const router = express.Router();

// Get Requests
router.get('/login', controller.getLogin);
router.get('/register', controller.getRegister);
router.get('/panel', autControl, controller.getUsers);
router.get('/logout', controller.logout);

// Post Requests
router.post('/register', controller.register);
router.post('/login', controller.login);

export = router;
