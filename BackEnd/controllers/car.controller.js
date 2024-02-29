import Joi from "joi";
import { client, car_verify } from "../models/data-model.js";


async function add_car(req, res) {
    try {
        const data = req.body;
        const { error } = car_verify.add_car.validate(data, { abortEarly: false });
        if (error) {
            res.status(400).json({ err: error.details[0].message });
            return;
        }
        const date = new Date();
        const register_date = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        if (data.manufacturing_date !== undefined) {
            const manuf_date = new Date(data.manufacturing_date);
            if (manuf_date > date) {
                res.status(400).json({ status: 'failed', mess: 'Invalid data' });
                return;
            }
        }
        await client.query(`call add_car('${register_date}','${data.brand}','${data.model}',${data.price},'${data.transmission}','${data.manufacturing_date ?? null}',${data.center_id ?? null})`);
        res.status(200).json({ status: 'success', mess: 'insertion done' });
        return;
    } catch (err) {
        console.log("there is an error occured during adding new car");
        res.status(400).json({ message: "there is an error occured during adding new car", error: err.details });
    }
}

async function update_car(req, res) {
    try {
        const data = req.body;
        const { error } = car_verify.update_car.validate(data, { abortEarly: false });
        if (error) {
            res.status(400).json({ err: error.details[0].message });
            return;
        }
        const oldCar = (await client.query(`select * from cars where car_id = ${data.car_id};`)).rows;
        if (data.manufacturing_date !== undefined) {
            const manuf_date = new Date(data.manufacturing_date);
            const date = oldCar[0].registration_date;
            if (manuf_date > date) {
                res.status(400).json({ status: 'failed', mess: 'Invalid data' });
                return;
            }
        }
        let attr_lis = ['brand', 'model', 'price', 'transmission', 'manufacturing_date', 'center_id', 'is_available'];
        let change = '';
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
        const num = (await client.query(`update cars set ${change} where car_id=${data.car_id};`)).rowCount;
        res.status(200).json({ status: 'success', rows: num });
        return;
    } catch (err) {
        console.log("there is an error occured during updating car");
        res.status(400).json({ message: "there is an error occured during updating car", error: err.details });
    }
}

async function del_car(req, res) {
    try {
        const data = req.body;
        const { error } = Joi.object({ car_id: Joi.number().integer().positive().required() }).validate(data, { abortEarly: false });
        if (error) {
            res.status(400).json({ err: error.details[0].message });
            return;
        }
        const num = (await client.query(`delete from cars where car_id = ${data.car_id}`)).rowCount;
        res.status(200).json({ status: 'success', rows: num });
        return;
    } catch (err) {
        console.log("there is an error occured during deleting car");
        res.status(400).json({ message: "there is an error occured during deleting car", error: err.details });
    }
}

async function getAll_cars(req, res) {
    try {
        const data = (await client.query(`select * from cars ;`)).rows;
        res.status(200).json({ status: 'success', table: data });
        return;

    } catch (err) {
        console.log("there is an error occured during showing center cars");
        res.status(400).json({ mess: "there is an error occured during showing center cars, try again", err })
        return;
    }

}


export { add_car, update_car, del_car, getAll_cars };