import { Router } from "express";
const complaintsRouter = Router();
//controllers
import { post_complaint, delete_complaints, get_all_complaints, update_complaint } from '../controllers/complaints_controller.js'

//opertions 
complaintsRouter.route('/')
    .post(post_complaint)
    .get(get_all_complaints)

complaintsRouter.route('/:id').delete(delete_complaints).patch(update_complaint)

export default complaintsRouter;