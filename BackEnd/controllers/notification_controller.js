import { client, notification_verify } from "../models/data-model.js";
async function postNotification(req, res) {
    try {
        const data = req.body;
        const { error } = notification_verify.postNotification_.validate(data, { abortEarly: false })
        if (error) {
            return res.status(400).send({ msg: error, status: "failed" });
        }
        if (!data.notification_date) {
            data.notification_date = new Date().toJSON().split("T")[0];
        }
        if (data.reciever_id.toString() == req.user.user_id.toString()) {
            const err = new Error();
            err.message = "you are not allowed to send notification to yourself";
            throw err
        }
        const q = `INSERT INTO public.notifications(
            sender_id, receiver_id, description, notification_date)
            VALUES  (${req.user.user_id},${data.reciever_id},'${data.description}', '${data.notification_date}');`
        await client.query(q);
        return res.status(200).send({ msg: "inserted successfully", status: "success" })
    } catch (error) {
        return res.status(400).send({ msg: error, status: "failed" });
    }

}
async function get_sended_or_recieved_notification_byID(req, res) {
    try {
        let q = "";
        if (req.user.user_type == 'Employee') {
            q = `select * from notifications where sender_id=${req.user.user_id} or receiver_id=${req.user.user_id}`;
        } else {
            q = `select * from notifications where receiver_id=${req.user.user_id}`;
        }
        const result = await client.query(q)
        return res.status(200).send({ data: result.rows, status: "success" })
    } catch (error) {
        return res.status(400).send({ msg: error, status: "failed" });
    }
}

async function delete_notification(req, res) {
    try {
        const { id } = req.params;
        if (!parseInt(id)) {
            const err = new Error();
            err.message = "id should be number"
            throw err
        }
        let q = `DELETE FROM public.notifications WHERE notification_id=${id};`
        const result = await client.query(q)
        return res.status(200).send({ deleted_rows: result.rowCount, status: "success" })
    } catch (error) {
        return res.status(400).send({ msg: error, status: "failed" });

    }
}

export { postNotification, get_sended_or_recieved_notification_byID, delete_notification }