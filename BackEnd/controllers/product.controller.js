import { compareSync } from "bcrypt";
import { client, product_verify } from "../models/data-model.js";

async function post_product(req, res) {
    try {
        const data = req.body;
        const { error } = product_verify.postProduct.validate(data);
        if (error) {
            return res.status(400).json({ err: error.details[0].message });
        }
        if (!data.brand) {
            var brand = null
        } else {
            var brand = `'${data.brand}'`
        }
        const q = `INSERT INTO public.products(
            price, product_type, brand,center_id)
            VALUES (${data.price}, '${data.product_type}', ${brand}, ${data.center_id});`;
        const result = await client.query(q)
        return res.status(200).send({ msg: "inserted successfuly", status: "success" })
    } catch (err) {
        return res.status(400).json({ msg: "there is an error occured during adding new product, try again", err })
    }
}
async function get_product_by_id(req, res, next) {
    try {
        const { id } = req.params
        if (!id) {
            const err = new Error();
            err.message = "you should specify the parameter id "
            throw err
        }
        let q = `select * from products where product_id=${id} `;
        const result = await client.query(q);
        res.status(200).send({ data: result.rows, status: "success" })
    } catch (error) {
        res.status(500).send({ msg: error, status: "failed" })
    }
}
async function get_products_by_center_id(req, res, next) {
    try {
        const { id } = req.params
        if (!id) {
            const err = new Error();
            err.message = "you should specify the parameter id "
            throw err
        }
        let q = `select * from products where center_id=${id} and customer_id is null `;
        const result = await client.query(q);
        res.status(200).send({ data: result.rows, status: "success" })
    } catch (error) {
        res.status(500).send({ msg: error, status: "failed" })
    }
}


async function update_product(req, res) {
    try {
        const { id } = req.params;
        const data = req.body;
        if (!parseInt(id)) {
            const err = new Error();
            err.message = "id should be number"
            throw err
        }
        if (!data.price) {
            var price = "";
        }
        else {
            var price = `price=${data.price},`
        }
        if (!data.brand) {
            var brand = ""
        } else {
            var brand = `brand='${data.brand}',`
        }
        if (!data.product_type) {
            var product_type = ""
        } else {
            var product_type = `product_type='${data.product_type}',`
        }
        if (!data.discount_id) {
            var discount_id = ""
        } else {
            var discount_id = `discount_id=${data.discount_id},`
        }
        let qq = `SELECT * FROM public.normal_users where user_id=${req.user.user_id}`;
        const buyer = (await client.query(qq));
        if (buyer.rowCount!=0) {
            var customer_id = `customer_id=${req.user.user_id},`
            
            //make query to get product price
            let product_balance = await client.query(`select * from products where product_id=${id}`)
            if (buyer.rows[0].balance && buyer.rows[0].balance >= product_balance.rows[0].price) {
                let q = `update public.normal_users set balance=balance-${product_balance.rows[0].price}`;
                await client.query(q);
                const date = new Date();
                let tempDate= `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
                var sold_date = `sold_date='${tempDate}',`
            } else {
                const err = new Error();
                err.message = "You don't have enough money";
                throw err
            }
        }else {
            var customer_id = ""
            var sold_date=""
        }
        if (!data.center_id) {
            var center_id = ""
        } else {
            var center_id = `center_id=${data.center_id},`
        }
        let temp = `${center_id} ${customer_id} ${discount_id} ${sold_date} ${product_type} ${brand} ${price}`
        let setPart = temp.trim();
        if (setPart[setPart.length - 1] == ',') {
            setPart = setPart.slice(0, -1)
        } else
            if (setPart[setPart[setPart.length - 1]] === " " && setPart[setPart.length - 2] === ",") {
                setPart = setPart.slice(0, -1)
            }
        let q = `UPDATE public.products
        SET ${setPart} WHERE product_id=${id};`
        const result = await client.query(q)
        return res.status(200).send({ updated_rows: result.rowCount, status: "success" })
    } catch (error) {
        return res.status(400).send({ msg: error, status: "failed" });

    }
}

async function delete_product(req, res) {
    try {
        const { id } = req.params;
        if (!parseInt(id)) {
            const err = new Error();
            err.message = "id should be number"
            throw err
        }
        let q = `DELETE FROM public.products WHERE product_id=${id};`
        console.log(q)
        const result = await client.query(q)
        return res.status(200).send({ deleted_rows: result.rowCount, status: "success" })
    } catch (error) {
        return res.status(400).send({ msg: error, status: "failed" });

    }
}

export { post_product, get_product_by_id, get_products_by_center_id, update_product, delete_product }