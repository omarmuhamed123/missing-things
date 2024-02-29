//////********************** user.controller has function for users which not related to other features ***************************///////

import Joi from "joi";
import jwt from "jsonwebtoken";
import { client, user_verify } from "../models/data-model.js";
import bcrypt, { hash } from 'bcrypt';

/**
 * 
 * first catagory       functions for all types of uers
 */

//(sign up for normal user ,deliveries) for employees: done by admin(other employees)
async function AddUser(req, res, next) {
    try {
        let base_att = ['fname', 'lname', 'phone_number', 'email', 'password', 'confirm_password',
            'sex', 'age', 'location', 'user_type'];
        const data = req.body;
        let common_part = {};
        base_att.forEach((ele) => {
            common_part = { ...common_part, [ele]: data[ele] };
            delete data[ele];
        });
        const { error } = user_verify.add.Normal_user.validate(common_part, { abortEarly: false });
        if (error) {
            res.status(400).json({ status: 'failed', err: error.details[0].message });
            return;
        }
        if (common_part.user_type === 'Delivery') {
            const { error } = user_verify.add.Delivery.validate(data, { abortEarly: false });
            if (error) {
                res.status(400).json({ status: 'failed', err: error.details[0].message });
                return;
            }
        } else if (common_part.user_type === 'Employee') {

            const { error } = user_verify.add.Employee.validate(data, { abortEarly: false });
            if (error) {
                res.status(400).json({ status: 'failed', err: error.details[0].message });
                return;
            }
            try {
                let authHeader = req.headers;
                if (!authHeader || !authHeader.authorization) {
                    return res.status(403).json({ message: 'No found token' });
                }
                authHeader = authHeader.authorization;
                if (!authHeader.startsWith("Bearer") || authHeader.split(" ").length !== 2) {
                    return res.status(401).json({ error: "Invalid token" });
                }
                const token = authHeader.split(" ")[1];
                const { id, user_type } = jwt.verify(token, process.env.SECRET);
                const user = (await client.query(`select * from Users where user_id = '${id}'`)).rows;
                if (user.length === 0) {
                    return res.status(403).json({ error: 'User not found"' });
                }
                req.user = { ...user[0], user_type };
                if (user_type === 'Employee') {
                    const is_admin = (await client.query(`select is_admin from employee where user_id = ${id};`)).rows[0].is_admin;
                    req.user = { ...req.user, is_admin };
                }
            } catch (err) {
                console.log(err);
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ error: "Your token has expired. Please log in again." });
                }
                res.status(401).json({ error: "Invalid token" });
                return;
            }
            if (!req.user) {
                res.status(400).json({ status: 'failed', err: 'you need to login' });
                return;
            }
            if (req.user.user_type !== 'Employee') {
                res.status(403).json({ error: " You are not an employee." });
                return;
            }


            if (!req.user.is_admin) {
                res.status(400).json({ status: 'failed', mess: 'You are not admin to add a new employee;' });
                return;
            }
            if (data.centerID !== undefined) {
                const same_location = (await client.query(`select * form centers where center_id = ${data.centerID} and center_location = '${common_part.location}'`)).rowCount;
                if (same_location === 0) {
                    res.status(400).json({ status: 'failed', mess: 'Different locations for employee and center' });
                    return;
                }
            }
        }
        const already_found = (await client.query(`select * from users where email = '${common_part.email ?? null}';`)).rowCount;
        if (already_found !== 0) {
            res.status(400).json({ error: 'Email is already exist' });
            return;
        }
        const hash_pass = await bcrypt.hash(common_part.password, 10);
        await client.query(`call add_user('${common_part.fname ?? null}','${common_part.lname ?? null}',${common_part.phone_number ?? null},'${common_part.email ?? null}','${hash_pass ?? null}','${common_part.sex ?? null}',${common_part.age ?? null},'${common_part.location ?? null}');`);
        const id = (await client.query(`select * from users where email = '${common_part.email ?? null}';`)).rows[0].user_id;
        if (common_part.user_type === 'Normal_user') {
            await client.query(`insert into normal_users (user_id) values(${id});`);
        } else if (common_part.user_type === 'Delivery') {
            await client.query(`insert into delivery values(${id},'${data.transmission}',${data.price_km},true,${data.balance});`);
        } else {
            await client.query(`insert into employee values (${id},${data.salary},${data.working_hours},${data.centerID ?? null},${data.isAdmin});`);
        }

        res.status(202).json({ status: 'success' });
    } catch (err) {
        res.status(400).json({ mess: "An error occurred while creating new account. Please try again.", err });
        console.log('there is error happenning creating new account');
        return;
    }
}


//can done by anyone
async function delMy_account(req, res) {
    try {
        await client.query(`delete from users where user_id = ${req.user.user_id}`);
    } catch (err) {
        res.status(400).json({ mess: "An error occurred while deleting my account.", err });
        console.log('there is error happenning while deleting my account');
        return;
    }
}

//can done by anyone
async function update_user(req, res) {
    try {
        let base_att = ['fname', 'lname', 'phone_number', 'email', 'password',
            'sex', 'age', 'location'];
        const data = req.body;
        let common_part = {};
        base_att.forEach((ele) => {
            common_part = { ...common_part, [ele]: data[ele] };
            delete data[ele];
        });
        const { error } = user_verify.update.user.validate(common_part, { abortEarly: false });
        if (error) {
            res.status(400).json({ status: 'failed', err: error.details[0].message });
            return;
        }
        let change_str = '';
        base_att.forEach((ele) => {
            if (common_part[ele] !== undefined) {
                if (ele === 'password') {
                } else {
                    change_str += `${ele}='${common_part[ele]}',`;
                }
            }
        });
        if (common_part['password'] !== undefined) {
            const hashed = await bcrypt.hash(common_part['password'], 10);
            change_str += `password='${hashed}',`;
        }

        if (req.user.user_type === 'Normal_user') {
            const { error } = Joi.object({
                balance: Joi.number().integer()
            }).validate(data, { abortEarly: false });
            if (error) {
                res.status(400).json({ status: 'failed', err: error.details[0].message });
                return;
            }
            let str_normal = '';
            if (data.balance !== undefined) {
                str_normal += `balance = ${data.balance}`;
            }
            if (str_normal !== '') {

                await client.query(`update normal_users set ${str_normal} where user_id = ${req.user.user_id};`);
            }
        } else if (req.user.user_type === 'Delivery') {
            const { error } = user_verify.update.Delivery.validate(data, { abortEarly: false });
            if (error) {
                res.status(400).json({ status: 'failed', err: error.details[0].message });
                return;
            }
            let str_deliv = '';
            let lis = ['transmission', 'price_km', 'balance'];
            lis.forEach((ele) => {
                if (data[ele] !== undefined) {
                    str_deliv += `${ele}='${data[ele]}',`;
                }
            });
            if (str_deliv !== '') {
                str_deliv = str_deliv.slice(0, str_deliv.length - 1);
                await client.query(`update delivery set ${str_deliv} where user_id = ${req.user.user_id};`);
            }
        }
        ////add update query for users table
        let updated_rows = 0;
        if (change_str !== '') {
            change_str = change_str.slice(0, change_str.length - 1);
            // console.log(change_str);
            updated_rows = (await client.query(`update users set ${change_str} where user_id = ${req.user.user_id};`)).rowCount;
        }
        res.status(200).json({ status: 'success', updated_rows });
        return;

    } catch (err) {
        res.status(400).json({ mess: "An error occurred while updating my account.", err });
        console.log('there is error happenning while updating my account');
        return;
    }
}

async function get_myUser(req, res) {
    try {
        const data = (await client.query(`select * from users where user_id = ${req.user.user_id}`)).rows;
        let more_info;
        if (req.user.user_type === 'Normal_user') {
            more_info = (await client.query(`select * from normal_users where user_id = ${req.user.user_id}`)).rows;
        } else if (req.user.user_type === 'Delivery') {
            more_info = (await client.query(`select * from delivery where user_id = ${req.user.user_id}`)).rows;
        } else {
            more_info = (await client.query(`select * from employee where user_id = ${req.user.user_id}`)).rows;
        }
        res.status(200).json({ status: 'success', data: { ...data[0], ...more_info[0], user_type: req.user.user_type } });
        return;
    } catch (err) {
        res.status(400).json({ mess: "An error occurred while showing all users.", err });
        console.log('there is error happenning while showing all users');
        return;
    }
}


/***
 * second catagory      functions for employee type
 * 
 */


//can done only by employees
async function getAllusers(req, res) {
    try {
        const data = (await client.query(`select * from users`)).rows;
        res.status(200).json({ status: 'success', data });
        return;
    } catch (err) {
        res.status(400).json({ mess: "An error occurred while showing all users.", err });
        console.log('there is error happenning while showing all users');
        return;
    }
}

////can done only by employees
async function getUser(req, res) {
    try {
        const { id } = req.params;
        const { error } = Joi.object({ id: Joi.number().integer().required() }).validate({ id }, { abortEarly: false });
        if (error) {
            res.status(400).json({ status: 'failed', err: error.details[0].message });
            return;
        }
        const user = (await client.query(`select * from users where user_id = ${id}`)).rows;
        if (user.length === 0) {
            res.status(400).json({ status: 'failed', mess: `Can't found this user` });
            return;
        }

        const normal = (await client.query(`select * from normal_users where user_id = ${id};`));
        if (normal.rowCount !== 0) {
            res.status(200).json({ status: 'success', data: { ...(user[0]), ...(normal.rows[0]), user_type: 'Normal_user' } });
            return;
        }
        const employee = (await client.query(`select * from employee where user_id = ${id};`));
        if (employee.rowCount !== 0) {
            res.status(200).json({ status: 'success', data: { ...(user[0]), ...(employee.rows[0]), user_type: 'Employee' } });
            return;
        }
        const delivery = (await client.query(`select * from delivery where user_id = ${id};`));
        if (delivery.rowCount !== 0) {
            res.status(200).json({ status: 'success', data: { ...(user[0]), ...(delivery.rows[0]), user_type: 'Delivery' } });
            return;
        }
        res.status(400).json({ status: 'failed', mess: `Can't found this user` });
        return;
    } catch (err) {
        res.status(400).json({ mess: "An error occurred while showing this user.", err });
        console.log('there is error happenning while showing this user');
        return;
    }
}

//can done only by employee, show only available deliveries which work in the same location of employee
async function get_available_deliv(req, res) {
    try {
        const delivery_data = (await client.query(`
        select 	d.user_id,transmission,price_km,avg(rate) as "overall rate"	from 
        ((delivery as d left outer join user_trips as t on d.user_id = t.driver_id) join users as u on d.user_id = u.user_id ) 
        where d.is_available = true group by d.user_id , u.location having u.location = '${req.user.location}';
        `)).rows;
        res.status(200).json({ status: 'success', delivery_data });
        return;
    } catch (err) {
        console.log("there is an error occured during getting available deliveries");
        res.status(400).json({ message: "there is an error occured during getting available deliveries", error: err.details });
        return;
    }
}



/**
 * third catagory       functions for delivery type
 * TODO: add function for choose the car for a delivery in a user trip
 * 
 * 
 */
//delivery or employee
async function get_available_car(req, res) {
    try {
        if (req.user.user_type === 'Normal_user') {
            res.status(400).json({ status: 'failed', mess: `You don't have permission` });
            return;
        }
        const car_data = (await client.query(`select car_id,brand,model,price,transmission from (cars join centers on cars.center_id = centers.center_id)
            where centers.center_location = '${req.user.location}' and cars.is_available = true;`)).rows;
        res.status(200).json({ status: 'success', car_data });
        return;
    } catch (err) {
        console.log("there is an error occured during getting available cars");
        res.status(400).json({ message: "there is an error occured during getting available cars", error: err.details });
    }
}

async function choose_car(req, res) {
    try {
        const data = req.body;
        const { error } = Joi.object({ car_id: Joi.number().integer().positive().required() }).validate(data, { abortEarly: false });
        if (error) {
            res.status(400).json({ status: 'failed', err: error.details[0].message });
            return;
        }
        //check if the current delivery has a usertrip -> is_available = false      AND       //check if he has a car in current time
        const deliv_trip = (await client.query(`select * from delivery where user_id = ${req.user.user_id} and is_available = false and drive_now = false;`)).rows;
        if (deliv_trip.length === 0) {
            res.status(400).json({ status: 'failed', err: 'You are not in a trip or You have already a car' });
            return;
        }

        //check if the chosen car id in the same location of delivery and available
        const car_found = (await client.query(`select * from (cars join centers on cars.center_id = centers.center_id)
            where centers.center_location = '${req.user.location}' and cars.is_available = true and cars.car_id = ${data.car_id}  ;`)).rowCount;
        if (car_found === 0) {
            res.status(400).json({ status: 'failed', mess: 'You can not choose this car' });
            return;
        }
        if (deliv_trip[0].transmission !== 'Both') {
            const can_drive = (await client.query(`select * from cars where car_id = ${data.car_id};`)).rows;
            if (can_drive[0].transmission !== deliv_trip[0].transmission) {
                res.status(400).json({ status: 'failed', mess: 'Not a suitable car for you' });
                return;
            }
        }
        console.log(deliv_trip[0]);
        const can_rent = (await client.query(`select rent(${data.car_id},${req.user.user_id},${deliv_trip[0].balance});`)).rows[0].rent;
        if (!can_rent) {
            res.status(400).json({ status: 'failed', mess: 'You do not have enough balance to rent this car' });
            return;
        }
        const cur_trip = (await client.query(`select * from user_trips where driver_id = ${req.user.user_id} and paid = false;`)).rows;
        const num = (await client.query(`update user_trips set car_id = ${data.car_id} where item_id = ${cur_trip[0].item_id};`)).rowCount;
        await client.query(`update cars set is_available = false where car_id = ${data.car_id};`);
        await client.query(`update delivery set drive_now = true where user_id = ${req.user.user_id};`);


        res.status(200).json({ status: 'success', rows: num });
        return;
    } catch (err) {
        console.log("there is an error occured during choosing one available cars");
        res.status(400).json({ message: "there is an error occured during choosing one available cars", error: err.details });
    }
}



export {
    AddUser, getAllusers, getUser, delMy_account,
    update_user, get_available_deliv, get_available_car,
    choose_car, get_myUser
};