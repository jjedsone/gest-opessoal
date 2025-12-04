import { Router } from 'express';
import { generateSuggestions, getSuggestions, acceptSuggestion, rejectSuggestion } from '../controllers/aiSuggestionController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.post('/generate', generateSuggestions);
router.get('/', getSuggestions);
router.post('/:id/accept', acceptSuggestion);
router.post('/:id/reject', rejectSuggestion);

export default router;

