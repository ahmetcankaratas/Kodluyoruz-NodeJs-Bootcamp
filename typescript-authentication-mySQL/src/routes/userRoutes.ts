import express from 'express';
import autControl from '../middleware/autControl';
import loginControl from '../middleware/loginControl';
import controller from '../controllers/userControllers';
import pageController from '../controllers/pageControllers';

const router = express.Router();

// Get Requests
router.get('/login', loginControl, pageController.getLogin);
router.get('/register', loginControl, pageController.getRegister);
router.get('/panel', autControl, pageController.getUsers);
router.get('/logout', controller.logout);
router.get('/', pageController.getIndex);

// Post Requests
router.post('/register', controller.register);
router.post('/login', controller.login);

export = router;
