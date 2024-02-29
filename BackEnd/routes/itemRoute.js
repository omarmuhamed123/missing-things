import { Router } from "express";
const itemRouter = Router();
//controllers
import { postItem, get_items_by_id,delete_items,update_items} from '../controllers/items_controller.js'

//opertions 
itemRouter.route('/')
    .post(postItem)
    .get(get_items_by_id)

itemRouter.route('/:id')
    .delete(delete_items)
    .patch(update_items)

export default itemRouter;