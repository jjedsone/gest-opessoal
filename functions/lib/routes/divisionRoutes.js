"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const divisionController_1 = require("../controllers/divisionController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken);
router.get('/', divisionController_1.getDivisionRules);
router.post('/', divisionController_1.createDivisionRule);
router.put('/:id', divisionController_1.updateDivisionRule);
router.delete('/:id', divisionController_1.deleteDivisionRule);
router.post('/calculate', divisionController_1.calculateDivision);
exports.default = router;
//# sourceMappingURL=divisionRoutes.js.map