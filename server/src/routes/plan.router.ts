import express from 'express';
import {
  createPlan,
  readPlan,
  readPlans,
  updatePlan,
  deletePlan,
} from '@controllers/plan.controller';
import { authenticate } from '@middleware/auth';

const router = express.Router();

router.use(authenticate);

router.post('/', createPlan);
router.get('/:id', readPlan);
router.get('/', readPlans);
router.put('/:id', updatePlan);
router.delete('/:id', deletePlan);

export default router;
