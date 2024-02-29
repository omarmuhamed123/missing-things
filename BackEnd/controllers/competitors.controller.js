import { client, competitor_verify } from "../models/data-model.js";
async function post_competitor(req, res) {
    try {
        const {id} = req.params;
        let item_id=id;
        if (!parseInt(item_id)) {
            const err = new Error();
            err.message = "you should specify valid id"
            throw err
        }
        const q = `INSERT INTO public.competitors(
            user_id, item_id)
            VALUES (${req.user.user_id}, ${item_id});`
        const result = await client.query(q)
        res.status(200).send({ msg: "inserted successfuly", status: "success" })
    } catch (error) {
        res.status(400).send({ msg: error, status: "failed" });
    }
}
async function get_competitors_by_item_id(req, res, next) {
    try {
        const { id } = req.params;
        if (!parseInt(id)) {
            const err = new Error();
            err.message = "you should specify valid id"
            throw err
        }
        let q = `select * from competitors where item_id=${id}`;
        const result = await client.query(q);
        res.status(200).send({ data: result.rows, status: "success" })
    } catch (error) {
        res.status(500).send({ msg: error, status: "failed" })
    }
}
async function get_all_competitors(req, res, next) {
    try {
        let q = `select * from competitors`;
        const result = await client.query(q);
        res.status(200).send({ data: result.rows, status: "success" })
    } catch (error) {
        res.status(500).send({ msg: error, status: "failed" })
    }
}
async function delete_competitor(req, res) {
    try {
        const {id } = req.params;
        let item_id=id
        if (!parseInt(id)) {
            const err = new Error();
            err.message = "id should be number"
            throw err
        }
        let q = `DELETE FROM public.competitors WHERE user_id=${req.user.user_id} and item_id=${item_id};`
        const result = await client.query(q)
        return res.status(200).send({ deleted_rows: result.rowCount, status: "success" })
    } catch (error) {
        return res.status(400).send({ msg: error, status: "failed" });

    }
}


export{ post_competitor, get_competitors_by_item_id,delete_competitor,get_all_competitors}