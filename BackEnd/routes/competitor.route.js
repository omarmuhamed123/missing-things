import { Router } from "express";
const competitorRouter = Router();
//controllers
import { post_competitor, delete_competitor, get_competitors_by_item_id} from '../controllers/competitors.controller.js'

//opertions 
competitorRouter.route('/:id').post(post_competitor)


competitorRouter.delete('/:id', delete_competitor)
competitorRouter.get('/:id', get_competitors_by_item_id)

export default competitorRouter;