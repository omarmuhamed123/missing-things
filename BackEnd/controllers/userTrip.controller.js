import { client, userTrip_verify } from "../models/data-model.js";
import Joi from "joi";

async function make_trip(req, res) {
    try {
        const data = req.body;
        const { error } = userTrip_verify.add_trip.validate(data, { abortEarly: false });

        if (error) {
            res.status(400).json({ err: error.details[0].message });
            return;
        }


        //check if this item in request body belongs to this user in request body and lost from him
        const item_of_user = (await client.query(`select * from items where owner_id = ${data.owner_id} and item_id = ${data.item_id} and is_lost = true`)).rowCount;
        const owner_loc = (await client.query(`select * from users as u,normal_users as n where 
            n.user_id = u.user_id and u.user_id = ${data.owner_id} and u.location = '${req.user.location}'`))
        const exist_deliv = (await client.query(`select * from delivery as d, users as u where
            d.user_id = u.user_id and u.user_id = ${data.driver_id} and u.location = '${req.user.location}';`)).rowCount;
        if (item_of_user === 0 || exist_deliv === 0) {
            res.status(400).json({ mess: "This user did not lost this item or can't found this delivery" });
            return;
        }
        //check if this delivery is available for making a user trip
        const found_deliv = (await client.query(`select * from delivery where user_id = ${data.driver_id} and is_available = true`)).rowCount;
        if (found_deliv === 0) {
            res.status(400).json({ mess: "This delivery isn't available for current time" });
            return;
        }
        await client.query(`insert into user_trips values (${data.driver_id},${data.owner_id},${data.item_id},${data.distance},${null},false)`);
        await client.query(`update delivery set is_available = false where user_id = ${data.driver_id};`);
        res.status(200).json({ status: 'success' });
        return;
    } catch (err) {
        console.log('there is a error occuring during adding new user trip.');
        res.status(403).json({ mess: 'there is a error occuring during adding new user trip.', err });
        return;
    }
}

async function delete_trip(req, res) {
    try {
        const data = req.body;
        const { error } = Joi.object({ item_id: Joi.number().integer().required() }).validate({ item_id: data.item_id }, { abortEarly: false });
        if (error) {
            res.status(400).json({ status: 'failed', mess: error.details[0].message });
            return;
        }
        const trip = (await client.query(`select * from user_trips where item_id = ${data.item_id};`)).rows;
        if (!trip[0].paid) {
            await client.query(`update delivery set is_available = true where user_id = ${trip[0].driver_id};`);
        }
        await client.query(`delete from user_trips where item_id = ${data.item_id}`);
        res.status(200).json({ status: 'success' });
        return;
    } catch (err) {
        console.log('there is a error occuring during deleting user trip.');
        res.status(403).json({ mess: 'there is a error occuring during deleting user trip.', err });
        return;
    }
}

async function showTrips(req, res) {
    try {
        if (req.user.user_type == 'Normal_user') {
            const trip_his = (await client.query(`select driver_id, item_id,distance,rate from user_trips where owner_id = ${req.user.user_id}`)).rows;
            res.status(200).json({ status: 'success', data: trip_his });
        } else if (req.user.user_type == 'Delivery') {
            const trip_his = (await client.query(`select owner_id, item_id,distance,rate from user_trips where driver_id = ${req.user.user_id}`)).rows;
            res.status(200).json({ status: 'success', data: trip_his });
        } else {
            const trip_his = (await client.query(`select * from user_trips`)).rows;
            res.status(200).json({ status: 'success', data: trip_his });
        }
        return;
    } catch (err) {
        console.log('there is a error occuring during showing user trips.');
        res.status(403).json({ mess: 'there is a error occuring during showing user trip.', err });
        return;
    }
}

async function update_trip(req, res) {
    try {
        const data = req.body;
        if (req.user.user_type == 'Delivery') {
            res.status(400).json({ status: 'failed', mess: 'The delivery has no permission to update trip information' });
            return;
        }
        if (req.user.user_type == 'Normal_user') {
            const { error } = userTrip_verify.normal_edit.validate(data, { abortEarly: false });
            if (error) {
                res.status(400).json({ status: 'failed', mes: error.details[0] });
                return;
            }
            /**
             * TODO    get the cost of the competiton if exist and if there is a winner
             *        
             * 
             */
            let cost = (await client.query(`select t.distance, d.price_km, t.driver_id from delivery as d, user_trips as t 
                where t.driver_id = d.user_id and t.item_id = ${data.item_id} and owner_id = ${req.user.user_id} and t.paid = false;`));;

            if (cost.rowCount !== 0) {
                const deliv_arrive = (await client.query(`select * from user_trips where item_id = ${data.item_id} and owner_id = ${req.user.user_id};`)).rows;
                if (deliv_arrive[0].car_id === null) {
                    res.status(400).json({ status: 'failed', mess: 'Delivery do not arrive yet' });
                    return;
                }
                let operation_price = cost.rows[0].distance * cost.rows[0].price_km;
                //function in database for pay from normal to delivery and change balance of normal user and delivery and reset the delivery to available
                // increase balance for the center as a constant service price = 50
                const can_pay = (await client.query(`select pay(${req.user.user_id},${cost.rows[0].driver_id},${operation_price})`)).rows[0].pay;

                if (!can_pay) {
                    res.status(400).json({ status: 'failed', mes: 'There is no enough balance to pay.' });
                    return;
                }
                await client.query(`update cars set is_available = true from 
                    (select * from (cars as c join user_trips as t on c.car_id = t.car_id) where c.car_id = ${deliv_arrive[0].car_id}) ;`);

            }
            const trip_count = (await client.query(`update user_trips set rate = ${data.rate} ,paid = true
                where item_id = ${data.item_id} and owner_id = ${req.user.user_id}`)).rowCount;

            res.status(200).json({ status: 'success', updated_rows: trip_count });
            return;
        } else {
            const { error } = userTrip_verify.emp_edit.validate(data, { abortEarly: false });
            if (error) {
                res.status(400).json({ status: 'failed', mess: error.details[0].message });
                return;
            }
            let change_driver = '';
            let chang_distance = '';

            if (data.driver_id !== undefined) {
                change_driver = `driver_id = ${data.driver_id},`;
                let new_deliv = (await client.query(`select * from delivery where user_id = ${data.driver_id};`)).rows;
                if (new_deliv.length === 0) {
                    res.status(400).son({ status: 'failed', mess: 'Not found this delivery' });
                    return;
                }
                let loc_deliv = (await client.query(`select * from users where user_id = ${data.driver_id};`)).rows;
                if (!new_deliv[0].is_available || loc_deliv[0].location !== req.user.location) {
                    res.status(400).json({ status: 'failed', mess: 'This driver is not available or not found in the same location' });
                    return;
                }
            }
            if (data.distance !== undefined) {
                chang_distance = `distance = ${data.distance},`;
            }

            if (change === '') {
                res.status(200).json({ status: 'success', mess: 'No update executed' });
                return;
            }
            change = change.slice(0, change.length - 1);
            const oldTrip = (await client.query(`select * from user_trips where item_id = ${data.item_id};`)).rows;
            const trip_count = (await client.query(`update user_trips set ${change} where item_id = ${data.item_id}`)).rowCount;
            if (change.includes('driver_id')) {
                await client.query(`update delivery set is_available = false where user_id = ${data.driver_id};`);
                await client.query(`update delivery set is_available = true where user_id = ${oldTrip[0].driver_id}`);
            }

            res.status(200).json({ status: 'success', updated_rows: trip_count });
            return;
        }

    } catch (err) {
        console.log('there is a error occuring during updating user trips.');
        res.status(403).json({ mess: 'there is a error occuring during updating user trip.', err });
        return;
    }
}


export { make_trip, delete_trip, showTrips, update_trip };