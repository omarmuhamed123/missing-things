import { Router } from "express";
import permission from "../middlewares/permission.middleware.js";
import { add_center, del_center, getCenters, update_center } from "../controllers/center.controller.js";

const centerRoute = new Router();

centerRoute.post('/', permission.employee, add_center);

centerRoute.patch('/', permission.employee, update_center);

centerRoute.delete('/', permission.employee, del_center);

centerRoute.get('/', permission.employee, getCenters);

export default centerRoute;