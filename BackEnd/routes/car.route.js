import { Router } from "express";
import permission from "../middlewares/permission.middleware.js";
import { add_car, del_car, getAll_cars, update_car } from "../controllers/car.controller.js";


const carRoute = new Router();

carRoute.post('/', permission.employee, add_car);

carRoute.patch('/', permission.employee, update_car);

carRoute.delete('/', permission.employee, del_car);

carRoute.get('/', permission.employee, getAll_cars);


export default carRoute;