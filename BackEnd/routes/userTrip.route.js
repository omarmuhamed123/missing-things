import { Router } from "express";
import permission from "../middlewares/permission.middleware.js";
import { make_trip, delete_trip, showTrips, update_trip } from "../controllers/userTrip.controller.js";

const user_trip_Route = new Router();


user_trip_Route.post('/', permission.employee, make_trip);
user_trip_Route.delete('/', permission.employee, delete_trip);
user_trip_Route.get('/', showTrips);
user_trip_Route.patch('/', update_trip);

export default user_trip_Route;