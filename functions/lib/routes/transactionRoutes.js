"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionController_1 = require("../controllers/transactionController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken);
router.post('/', transactionController_1.createTransaction);
router.get('/', transactionController_1.getTransactions);
router.get('/:id', transactionController_1.getTransactionById);
router.delete('/:id', transactionController_1.deleteTransaction);
exports.default = router;
//# sourceMappingURL=transactionRoutes.js.map