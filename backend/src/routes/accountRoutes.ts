import { Router } from 'express';
import { getAccounts, createAccount, getAccountBalance } from '../controllers/accountController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getAccounts);
router.post('/', createAccount);
router.get('/balance', getAccountBalance);

export default router;

