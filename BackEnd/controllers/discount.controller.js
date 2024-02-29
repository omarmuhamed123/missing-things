import { client, discount_verify } from "../models/data-model.js";
async function postDiscount(req, res) {
    try {
        const data = req.body;
        const { error } = discount_verify.postDiscount.validate(data);
        if (error) {
            return res.status(400).send({ msg: error, status: "failed" });
        }
    
        const q = `INSERT INTO public.discounts(
             start_date, end_date, percentage)
            VALUES ('${data.start_date}', '${data.end_date}', ${data.percentage});`
        const result = await client.query(q)
        res.status(200).send({ msg: "inserted successfuly", status: "success" })
    } catch (error) {
        res.status(400).send({ msg: error, status: "failed" });
    }
}
async function get_discount_by_id(req, res, next) {
    try {
        console.log(req.params)
        const { id } = req.params;
        if (!parseInt(id)) {
            const err = new Error();
            err.message = "you should specify valid id"
            throw err
        }
        let q = `select * from discounts where discount_id=${id}`;
        const result = await client.query(q);
        res.status(200).send({ data: result.rows, status: "success" })
    } catch (error) {
        res.status(500).send({ msg: error, status: "failed" })
    }
}
async function get_all_discount(req, res, next) {
    try {
        let q = `select * from discounts`;
        const result = await client.query(q);
        res.status(200).send({ data: result.rows, status: "success" })
    } catch (error) {
        res.status(500).send({ msg: error, status: "failed" })
    }
}
async function delete_discount(req, res) {
    try {
        const { id } = req.params;
        if (!parseInt(id)) {
            const err = new Error();
            err.message = "id should be number"
            throw err
        }
        let q = `DELETE FROM public.discounts WHERE discount_id=${id};`
        const result = await client.query(q)
        return res.status(200).send({ deleted_rows: result.rowCount, status: "success" })
    } catch (error) {
        return res.status(400).send({ msg: error, status: "failed" });

    }
}

async function update_discount(req, res) {
    try {
        const { id } = req.params;
        const data = req.body;
        if (!parseInt(id)) {
            const err = new Error();
            err.message = "id should be number"
            throw err
        }
        if (!data.start_date) {
            var start_date = "";
        }
        else {
            var start_date = `start_date='${data.start_date}',`
        }
        if (!data.end_date) {
            var end_date = ""
        } else {
            var end_date = `end_date='${data.end_date}',`
        }
        if (!data.percentage) {
            var percentage = ""
        } else {
            var percentage = `percentage=${data.percentage},`
        }
        let temp = `${start_date} ${end_date} ${percentage}`
        let setPart = temp.trim();
        if (setPart[setPart.length - 1] == ',') {
            setPart = setPart.slice(0, -1)
        } else
            if (setPart[setPart[setPart.length - 1]] === " " && setPart[setPart.length - 2] === ",") {
                setPart = setPart.slice(0, -1)
            }
        let q = `UPDATE public.discounts
        SET ${setPart} WHERE discount_id=${id};`
        const result = await client.query(q)
        return res.status(200).send({ updated_rows: result.rowCount, status: "success" })
    } catch (error) {
        return res.status(400).send({ msg: error, status: "failed" });

    }
}
export{ postDiscount, get_discount_by_id,delete_discount,update_discount,get_all_discount}