import { Router } from "express";
const discountsRouter = Router();
//controllers
import { postDiscount, get_discount_by_id,delete_discount,update_discount,get_all_discount} from '../controllers/discount.controller.js'

//opertions 
discountsRouter.route('/')
    .post(postDiscount)
    .get(get_all_discount)

discountsRouter.route('/:id')
    .delete(delete_discount)
    .patch(update_discount)
    .get(get_discount_by_id)


export default discountsRouter;