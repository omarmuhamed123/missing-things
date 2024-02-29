import { Router } from "express";
const productRouter = Router();
//controllers
import { post_product, get_product_by_id, get_products_by_center_id, update_product, delete_product } from '../controllers/product.controller.js'

//opertions 
productRouter.route('/').post(post_product)
//productRouter.get('/:id',get_product_by_id)
productRouter.route('/:id').get(get_products_by_center_id)
    .patch(update_product)
    .delete(delete_product)
export default productRouter;