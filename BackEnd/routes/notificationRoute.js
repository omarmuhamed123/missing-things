import { Router } from "express";
const notificationRouter = Router();
//controllers
import {postNotification,get_sended_or_recieved_notification_byID,delete_notification} from '../controllers/notification_controller.js'

//opertions 
notificationRouter.route('/')
    .post(postNotification)
//you should specify the query parameter id = & sender or reciceve for sending set sender =1
notificationRouter.get('/',get_sended_or_recieved_notification_byID)
notificationRouter.delete('/:id',delete_notification)
export default notificationRouter;