"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aiSuggestionController_1 = require("../controllers/aiSuggestionController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken);
router.post('/generate', aiSuggestionController_1.generateSuggestions);
router.get('/', aiSuggestionController_1.getSuggestions);
router.post('/:id/accept', aiSuggestionController_1.acceptSuggestion);
router.post('/:id/reject', aiSuggestionController_1.rejectSuggestion);
exports.default = router;
//# sourceMappingURL=aiSuggestionRoutes.js.map