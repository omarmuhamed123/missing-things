import { client, complaint_verify } from "../models/data-model.js";
async function update_complaint(req, res) {
    try {
        const { id } = req.params;
        const data = req.body;
        if (!parseInt(id)) {
            const err = new Error();
            err.message = "id should be number"
            throw err
        }
        if (!data.feedback) {
            var feedback = "";
        }
        else {
            var feedback = `feedback='${data.feedback}',`
        }
        if (!data.status) {
            var status = ""
        } else {
            var status = `status='${data.status}',`
        }
        if (data.status == 'resolved') {
            const date = new Date();
            let tempDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
            var resolved_date = `resolved_date='${tempDate}',`
        } else {
            resolved_date = "";
        }
        let temp = `${resolved_date} ${status} ${feedback}`
        let setPart = temp.trim();
        if (setPart[setPart.length - 1] == ',') {
            setPart = setPart.slice(0, -1)
        } else
            if (setPart[setPart[setPart.length - 1]] === " " && setPart[setPart.length - 2] === ",") {
                setPart = setPart.slice(0, -1)
            }
        let q = `UPDATE public.complaints
        SET ${setPart} WHERE complaint_id=${id};`
        const result = await client.query(q)
        return res.status(200).send({ updated_rows: result.rowCount, status: "success" })
    } catch (error) {
        return res.status(400).send({ msg: error, status: "failed" });

    }
}
async function post_complaint(req, res) {
    try {
        const data = req.body;
        const { error } = complaint_verify.post_complaints.validate(data, { abortEarly: false })
        if (error) {
            return res.status(400).send({ msg: error.details[0].message, status: "failed" });
        }
        const tempDate = new Date();
        data.send_date = `${tempDate.getMonth() + 1}-${tempDate.getDate()}-${tempDate.getFullYear()}`
        console.log(data.send_date);
        const q = `INSERT INTO public.complaints(
            description, send_date,user_id)
            VALUES  ('${data.description}','${data.send_date}', '${req.user.user_id}');`
        await client.query(q);
        return res.status(200).send({ msg: "inserted successfully", status: "success" })
    } catch (error) {
        return res.status(400).send({ msg: error, status: "failed" });

    }
}
async function delete_complaints(req, res) {

    try {
        const { id } = req.params;
        if (!parseInt(id)) {
            const err = new Error();
            err.message = "id should be number"
            throw err
        }
        let q = `DELETE FROM public.complaints WHERE complaint_id=${id};`
        const result = await client.query(q)
        return res.status(200).send({ deleted_rows: result.rowCount, status: "success" })
    } catch (error) {
        return res.status(400).send({ msg: error, status: "failed" });

    }
}

async function get_all_complaints(req, res) {
    try {
        let q = `select * from complaints`;
        const result = await client.query(q);
        res.status(200).send({ data: result.rows, status: "success" })
    } catch (error) {
        res.status(500).send({ msg: error, status: "failed" })
    }
}


export { post_complaint, delete_complaints, get_all_complaints, update_complaint }
