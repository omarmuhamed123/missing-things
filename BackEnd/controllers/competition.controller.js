import { client, comp_verify } from "../models/data-model.js";


async function add_comp(req, res) {
    try {
        const data = req.body;
        const { error } = comp_verify.add_comp.validate(data, { abortEarly: false });
        if (error) {
            res.status(400).json({ err: error.details[0].message });
            return;
        }
        //there is already competiton with this information
        const exist = (await client.query(`select * from competitions where searched_item = ${data.item_id} and competition_name = '${data.name}'`)).rowCount;
        if (exist !== 0) {
            res.status(400).json({ err: 'there is already a competition with the same name for the same item' });
            return;
        }
        //it can be canceled if we use like a combo box in gui which contain only user's losted items
        const myItem = (await client.query(`select * from items where item_id = ${data.item_id} and is_lost = true and owner_id = ${req.user.user_id}`)).rowCount;
        if (myItem === 0) {
            res.status(400).json({ mess: 'There is invalid data. Check on the id of losted item' });
            return;
        }
        const date = new Date();
        const start_date = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        date.setDate(new Date().getDate() + data.duration);
        const end_date = `${date.getMonth() + 1}/${date.getDate() + 1}/${date.getFullYear()}`;
        await client.query(`call add_comp(${data.item_id},'${data.name}','${start_date}','${end_date}','${data.description}',${data.price},${req.user.user_id},null)`)
        res.status(200).json({ status: 'success' });
        return;
    } catch (err) {
        console.log("there is an error occured during adding new competititon");
        res.status(400).json({ mess: "there is an error occured during adding new competititon, try again", err })
        return;
    }
}

async function delete_comp(req, res) {
    try {
        const data = req.body;
        const { error } = comp_verify.del_comp.validate(data, { abortEarly: false });
        if (error) {
            res.status(400).json({ err: error.details[0].message });
            return;
        }

        const execute = (
            await client.query(`delete from competitions where searched_item = ${data.item_id} and competition_name = '${data.name}' and manager_id = ${req.user.user_id}`)
        ).rowCount;
        if (execute === 0) {
            res.status(400).json({ mess: 'there is not a competition with this name and itme item created by you' });
            return;
        }
        //it can be canceled if we use like a combo box in gui which contain only user's losted items
        res.status(200).json({ status: 'success', del_rows: execute });
        return;
    } catch (err) {
        console.log("there is an error occured during deleting competititon");
        res.status(400).json({ mess: "there is an error occured during deleting competititon, try again", err })
        return;
    }
}

async function showAll_Comp(req, res) {      //show all competitons without user's competitions
    try {
        const date = new Date();
        const curdate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        const data = (await client.query(`select competition_name, start_date, end_date,description,price from competitions
            where manager_id != ${req.user.user_id} and end_date > '${curdate}';`)).rows;
        res.status(200).json({ status: 'success', table: data });
        return;

    } catch (err) {
        console.log("there is an error occured during showing all competititon");
        res.status(400).json({ mess: "there is an error occured during showing all competititon, try again", err })
        return;
    }
}

async function updateComp(req, res) {
    try {
        const data = req.body;
        const { error } = comp_verify.update_comp.validate(data, { abortEarly: false });
        if (error) {
            res.status(400).json({ err: error.details[0].message });
            return;
        }
        let attr_lis = ['description', 'price'];
        let new_change = '';
        attr_lis.forEach((ele) => {
            if (data[ele] !== undefined) {
                new_change += `${ele}='${data[ele]}',`;
            }
        });
        const oldComp = (await client.query(`select * from competitions where searched_item = ${data.item_id} and competition_name = '${data.name}';`)).rows;
        let start = oldComp[0].start_date;
        let end = oldComp[0].end_date;
        if (data.duration !== undefined) {
            if (oldComp.length === 0) {
                res.status(400).json({ status: 'failed', mess: 'Invalid data' });
                return;
            }
            const date = start;
            start = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
            date.setDate(date.getDate() + data.duration);
            end = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        } else {
            start = `${start.getMonth() + 1}/${start.getDate()}/${start.getFullYear()}`;
            end = `${end.getMonth() + 1}/${end.getDate()}/${end.getFullYear()}`;
        }
        new_change += `start_date='${start}',`;
        new_change += `end_date='${end}'`;
        const updated_rows = (await client.query(`update competitions set ${new_change} where searched_item = ${data.item_id} and competition_name = '${data.name}';`)).rowCount;
        res.status(200).json({ status: 'success', updated_rows });
        return;

    } catch (err) {
        console.log("there is an error occured during updating competititon");
        res.status(400).json({ mess: "there is an error occured during updating competititon, try again", err })
        return;
    }
}

async function get_user_comp(req, res) {
    try {
        const data = (await client.query(`select * from competitions where manager_id = ${req.user.user_id} ;`)).rows;
        res.status(200).json({ status: 'success', table: data });
        return;

    } catch (err) {
        console.log("there is an error occured during showing my competititon");
        res.status(400).json({ mess: "there is an error occured during showing my competititon, try again", err })
        return;
    }
}

export { add_comp, delete_comp, showAll_Comp, updateComp, get_user_comp };