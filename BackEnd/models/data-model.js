import dotenv from 'dotenv';
import { json } from 'express';
import Joi from 'joi';
import pkg from 'pg';
const { Client } = pkg;
dotenv.config({ path: './.env' });



const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
});



const user_verify = {
    add: {
        Normal_user: Joi.object({
            fname: Joi.string().min(3).max(50).required(),
            lname: Joi.string().min(3).max(50).required(),
            phone_number: Joi.number().integer().required(),
            email: Joi.string().max(50).email().required(),
            password: Joi.string().min(8).required(),
            confirm_password: Joi.string().min(8).valid(Joi.ref('password')).required(),
            sex: Joi.string().valid('Male', 'Female').required(),
            age: Joi.number().integer(),
            location: Joi.string().required(),
            user_type: Joi.string().valid('Normal_user', 'Delivery', 'Employee').required()
        }),
        Delivery: Joi.object({
            transmission: Joi.string().valid('Manual', 'Automatic', 'Both').required(),
            price_km: Joi.number().precision(3).positive().required(),
            balance: Joi.number().integer().required()
        }),
        Employee: Joi.object({
            salary: Joi.number().integer().required(),
            working_hours: Joi.number().integer().required(),
            centerID: Joi.number().integer(),
            isAdmin: Joi.boolean().required()
        })
    },
    update: {
        user: Joi.object({
            fname: Joi.string().min(3).max(50),
            lname: Joi.string().min(3).max(50),
            phone_number: Joi.number().integer(),
            email: Joi.string().max(50).email(),
            password: Joi.string().min(8),
            sex: Joi.string().valid('Male', 'Female'),
            age: Joi.number().integer(),
            location: Joi.string(),
        }),
        Delivery: Joi.object({
            transmission: Joi.string().valid('Manual', 'Automatic', 'Both'),
            price_km: Joi.number().precision(3).positive(),
            balance: Joi.number().integer(),
            is_available: Joi.any()
        })
    },
    logIn: Joi.object({
        email: Joi.string().max(50).email().required(),
        password: Joi.string().min(8).required(),
        user_type: Joi.string().valid('Employee', 'Normal_user', 'Delivery').required()
    })

};

const comp_verify = {
    add_comp: Joi.object({
        name: Joi.string().min(5).required(),
        item_id: Joi.number().integer().positive().required(),
        duration: Joi.number().integer().positive().required(),    //days from start date to end date
        description: Joi.string().min(10).required(),
        price: Joi.number().precision(3).positive().required()
    }),
    del_comp: Joi.object({
        item_id: Joi.number().integer().positive().required(),
        name: Joi.string().min(5).required()
    }),
    update_comp: Joi.object({
        name: Joi.string().min(5).required(),
        item_id: Joi.number().integer().positive().required(),
        duration: Joi.number().positive().integer(),    //days from start date to end date
        description: Joi.string().min(10),
        price: Joi.number().precision(3).positive()
    })
};

const item_verify = {
    postItem: Joi.object({
        item_location: Joi.string().min(3).required(),
        item_color: Joi.string().min(3),
        is_lost: Joi.bool().required(),
        item_date: Joi.date().required(),
        item_type: Joi.string().required(),
        brand: Joi.string(),
        version_type: Joi.string(),
        glass_size: Joi.string(),
        glass_lens_type: Joi.string(),
        phone_ip: Joi.string(),
        owner_id: Joi.number(),
    })
};

const notification_verify = {
    postNotification_: Joi.object({
        sender_id: Joi.number(),
        reciever_id: Joi.number().required(),
        notification_date: Joi.date().default(new Date()),
        description: Joi.string().required(),
    })
}

const complaint_verify = {
    post_complaints: Joi.object({
        description: Joi.string().required(),
    })
};

const userTrip_verify = {
    add_trip: Joi.object({
        driver_id: Joi.number().integer().positive().required(),
        owner_id: Joi.number().integer().positive().required(),
        item_id: Joi.number().integer().positive().required(),
        distance: Joi.number().precision(2).positive().required(),
        rate: Joi.any(),
        paid: Joi.any()
    }),
    normal_edit: Joi.object({       //validation for data when normal user update the rate
        item_id: Joi.number().integer().positive().required(),
        rate: Joi.number().precision(2).less(10.00).positive().required(),
        driver_id: Joi.any(),
        owner_id: Joi.any(),
        distance: Joi.any(),
        paid: Joi.any()

    }),
    emp_edit: Joi.object({
        item_id: Joi.number().integer().positive().required(),
        driver_id: Joi.number().integer().positive(),
        distance: Joi.number().precision(2).positive(),
        owner_id: Joi.any(),
        rate: Joi.any(),
        paid: Joi.any()
    })
};

const product_verify = {
    postProduct: Joi.object({
        price: Joi.number().required(),
        product_type: Joi.string().valid('laptop', 'phone', 'glass', 'watch').required(),
        brand: Joi.string(),
        center_id: Joi.number().required(),
    })
}

const discount_verify = {
    postDiscount: Joi.object({
        start_date: Joi.date().required(),
        end_date: Joi.date().required(),
        percentage: Joi.number().required()
    })
}

const competitor_verify = {
    post_competitor: Joi.object({
        user_id: Joi.number().required(),
        item_id: Joi.number().required(),
    })
};

const center_verify = {
    add_center: Joi.object({
        center_name: Joi.string().min(2).required(),
        contact_number: Joi.number().integer().positive().required(),
        email: Joi.string().email().max(50).required(),
        center_location: Joi.string().min(2).required(),
        balance: Joi.number().precision(3).positive().required(),
        rent_price: Joi.number().positive().precision(3),
        opening_hours: Joi.number().positive().integer()
    }),
    update_center: Joi.object({
        center_id: Joi.number().integer().positive().required(),
        center_name: Joi.string().min(2),
        contact_number: Joi.number().integer().positive(),
        email: Joi.string().email().max(50),
        center_location: Joi.string().min(2),
        balance: Joi.number().precision(3).positive(),
        rent_price: Joi.number().positive().precision(3),
        opening_hours: Joi.number().positive().integer()
    })

};

const car_verify = {
    add_car: Joi.object({
        brand: Joi.string().min(2).max(50).required(),
        model: Joi.string().min(2).max(50).required(),
        price: Joi.number().precision(2).positive().required(),
        transmission: Joi.string().valid('Manual','Automatic').required(),
        manufacturing_date: Joi.date(),
        center_id: Joi.number().integer().positive()
    }),
    update_car: Joi.object({
        car_id: Joi.number().integer().positive().required(),
        brand: Joi.string().min(2).max(50),
        model: Joi.string().min(2).max(50),
        price: Joi.number().precision(2).positive(),
        transmission: Joi.string().valid('Manual','Automatic'),
        manufacturing_date: Joi.date(),
        center_id: Joi.number().integer().positive(),
        is_available: Joi.boolean()
    })
};

export {
    client, user_verify, comp_verify, item_verify,
    notification_verify, complaint_verify, userTrip_verify,
    product_verify, discount_verify, competitor_verify,
    center_verify, car_verify
};
