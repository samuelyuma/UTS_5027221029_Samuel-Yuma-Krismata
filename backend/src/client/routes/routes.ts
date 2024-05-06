import express from "express";

import * as employeeControllers from "../controllers/employee";

const router = express.Router();

router.get("/employee", employeeControllers.getAllEmployee);
router.get("/employee/:id", employeeControllers.getEmployee);
router.post("/employee", employeeControllers.createEmployee);
router.patch("/employee/:id", employeeControllers.updateEmployee);
router.delete("/employee/:id", employeeControllers.deleteEmployee);

export default router;
