import { Router } from 'express';
import { getDivisionRules, createDivisionRule, updateDivisionRule, deleteDivisionRule, calculateDivision } from '../controllers/divisionController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getDivisionRules);
router.post('/', createDivisionRule);
router.put('/:id', updateDivisionRule);
router.delete('/:id', deleteDivisionRule);
router.post('/calculate', calculateDivision);

export default router;

