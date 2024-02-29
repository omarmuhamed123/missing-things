import Joi from "joi";
import { center_verify, client } from "../models/data-model.js";


//done by employee(admin)
async function add_center(req, res) {
    try {
        const data = req.body;
        const { error } = center_verify.add_center.validate(data, { abortEarly: false });
        if (error) {
            res.status(400).json({ err: error.details[0].message });
            return;
        }
        if (!req.user.is_admin) {
            res.status(400).json({ status: 'failed', mess: 'You are not an admin' });
            return;
        }
        await client.query(`call add_center('${data.center_name}',${data.contact_number},'${data.email}','${data.center_location}',
            ${data.rent_price ?? null},${data.opening_hours ?? null},${data.balance}); `);
        res.status(200).json({ status: 'success', mess: 'insertion done' });
        return;
    } catch (err) {
        console.log("there is an error occured during adding new center");
        res.status(400).json({ message: "there is an error occured during adding new center", error: err.details });
    }
}

async function update_center(req, res) {
    try {
        const data = req.body;
        const { error } = center_verify.update_center.validate(data, { abortEarly: false });
        if (error) {
            res.status(400).json({ err: error.details[0].message });
            return;
        }
        if (!req.user.is_admin) {
            res.status(400).json({ status: 'failed', mess: 'You are not an admin' });
            return;
        }
        let change = '';
        let attr_lis = ['center_name', 'contact_number', 'email', 'center_location', 'balance', 'rent_price', 'opening_hours'];
        attr_lis.forEach((ele) => {
            if (data[ele] !== undefined) {
                change += `${ele}='${data[ele]}',`;
            }
        });
        if (change === '') {
            res.status(200).json({ status: 'success', mess: 'No update executed' });
            return;
        }
        change = change.slice(0, change.length - 1);
        const num = (await client.query(`update centers set ${change} where center_id=${data.center_id}`)).rowCount;
        res.status(200).json({ status: 'success', rows: num });
        return;
    } catch (err) {
        console.log("there is an error occured during updating center");
        res.status(400).json({ message: "there is an error occured during updating center", error: err.details });
    }
}

async function del_center(req, res) {
    try {
        const data = req.body;
        const { error } = Joi.object({ center_id: Joi.number().integer().positive().required() }).validate(data, { abortEarly: false });
        if (error) {
            res.status(400).json({ err: error.details[0].message });
            return;
        }
        if (!req.user.is_admin) {
            res.status(400).json({ status: 'failed', mess: 'You are not an admin' });
            return;
        }
        const num = (await client.query(`delete from centers where center_id = ${data.center_id}`)).rowCount;
        res.status(200).json({ status: 'success', rows: num });
        return;
    } catch (err) {
        console.log("there is an error occured during deleting center");
        res.status(400).json({ message: "there is an error occured during deleting center", error: err.details });
    }

}
//question showing all center done for employees(admin or not admin)
async function getCenters(req, res) {
    try {

        const data = (await client.query(`select * from centers`)).rows;
        res.status(200).json({ status: 'success', data });
        return;
    } catch (err) {
        console.log("there is an error occured during showing all centers");
        res.status(400).json({ message: "there is an error occured during showing all centers", error: err.details });
    }
}

export { add_center, update_center, del_center, getCenters };
