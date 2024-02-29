CREATE TABLE items (
	item_id serial primary key,
	item_location varchar not null,
	item_color varchar,
	item_photo varchar,	
	is_lost  bool,
	item_date date,
	item_type varchar not null,
	brand varchar,
	version_type varchar,
	glass_size varchar,
	glass_lens_type varchar,
	phone_ip varchar,
	owner_id int
	);

	create table complaints(
	complaint_id serial primary key,
	description varchar not null,
	status varchar default 'in progress',
	send_date date,
	resolved_date date,
	feedback varchar,
	user_id integer not null
	);
	

	create table competitions (
	searched_item int not null,
	competition_name varchar not null,
	primary key(searched_item,competition_name),
	start_date date not null,
	end_date date,
	description varchar not null,
	price float not null,
	manager_id int not null,
	winner_id int
	);

	create table user_trips (
	driver_id int,
	owner_id int,
	item_id int not null,
	primary key(item_id),
	distance float not null,
	rate float
	);

	create table competitors (
	user_id int not null,
	item_id int not null,
	primary key(user_id,item_id)
	);
	create table normal_users(
		user_id serial primary key,
		is_blocked bool default false,
		is_donner bool default false,
		account_number bigint,
		balance float 
	);
	create table notifications (
		notification_id serial,
		sender_id int not null,	
		receiver_id int not null,
		primary key(sender_id,receiver_id,notification_id),
		description varchar not null,
		notification_date date not null
	);

	create table centers (
		center_id serial primary key,
		center_name varchar not null,
		contact_number bigint not null,
		email varchar not null,
		center_location varchar not null,
		rent_price float not null,
		opening_hours float not null,
		profits float ,
		balance float default 0,
		account_number bigint
	);
		create table center_events(
		center_id int not null,
		foreign key (center_id) references centers,
		event_id int not null,
		primary key (center_id,event_id)
	);

	create table from_center_to_another(
	center1_id int not null,
	center2_id int not null,
	primary key (center1_id,center2_id),
-- 	foreign key (center1_id) references centers,
-- 	foreign key (center2_id) references centers,
	travel_cost  float not null,
	travel_distance float not null
);

	create table discounts(
		discount_id serial primary key,
		start_date date not null,
		end_date date not null,
		percentage float not null
	);
	create table products(
		product_id serial primary key,
		price float not null,
		product_type varchar not null,
		brand varchar,
		sold_date date,
		discount_id int,
		foreign key (discount_id) references discounts,
		customer_id int,
		center_id int not null,
		foreign key (center_id) references centers
	);
-------------items----------------
-- ALTER TABLE items
-- ADD CONSTRAINT items_forgin_user
-- FOREIGN KEY (owner_id)
-- REFERENCES normal_users
-- on delete set null
-- on update cascade;

-----------------from_center_to_another-------------
-- ALTER TABLE from_center_to_another
-- ADD CONSTRAINT from_center_to_another_forgin_center1
-- FOREIGN KEY (center1_id)
-- REFERENCES centers
-- on delete cascade
-- on update cascade;

-- ALTER TABLE from_center_to_another
-- ADD CONSTRAINT from_center_to_another_forgin_center2
-- FOREIGN KEY (center2_id)
-- REFERENCES centers
-- on delete cascade
-- on update cascade;

-----------------center_event
-- ALTER TABLE center_events
-- ADD CONSTRAINT center_event_forgin_center
-- FOREIGN KEY (center_id)
-- REFERENCES centers
-- on delete cascade
-- on update cascade;

--------------comptitons------------------
-- ALTER TABLE competitions
-- ADD CONSTRAINT competition_forgin_items
-- FOREIGN KEY (searched_item)
-- REFERENCES items
-- on delete cascade
-- on update cascade;

-- ALTER TABLE competitions
-- ADD CONSTRAINT competition_forgin_winner
-- FOREIGN KEY (winner_id)
-- REFERENCES normal_users
-- on delete set null
-- on update cascade;

-- ALTER TABLE competitions
-- ADD CONSTRAINT competition_forgin_manager_id
-- FOREIGN KEY (manager_id)
-- REFERENCES normal_users
-- on delete set null
-- on update cascade;


-- ----------competitors -------------------
-- ALTER TABLE competitors
-- ADD CONSTRAINT competition_normal_user
-- FOREIGN KEY (user_id)
-- REFERENCES normal_users
-- on delete cascade
-- on update cascade;

-- ALTER TABLE competitors
-- ADD CONSTRAINT competition_forgin_item
-- FOREIGN KEY (item_id)
-- REFERENCES items
-- on delete cascade
-- on update cascade;

-- ------------------products--------------------
-- ALTER TABLE products
-- ADD CONSTRAINT product_normal_user
-- FOREIGN KEY (customer_id)
-- REFERENCES normal_users
-- on delete set null
-- on update cascade;

-- ALTER TABLE products
-- ADD CONSTRAINT product_center
-- FOREIGN KEY (center_id)
-- REFERENCES centers
-- on delete set null
-- on update cascade;

-- ALTER TABLE products
-- ADD CONSTRAINT product_discount
-- FOREIGN KEY (discount_id)
-- REFERENCES discounts
-- on delete set null
-- on update cascade;


------------------------------




CREATE TABLE cars(
car_id		serial	NOT NULL,
registration_date		Date,
Brand		Varchar(50)		not null,
Model		Varchar(50)		not null,
Pirce		INT		not null,
transmission	Varchar(50)   check(Transmission in ('Manual', 'Automatic')),
is_available		boolean 	not null,
manufacturing_date		Date,

Primary key(Car_id)
);
alter table cars
add center_id int
CREATE TABLE events(
Event_id		serial	not null,
event_name		varchar(50)  not null,
Description		text	not null,
Start_date		date		not null,
End_date		date		not null,
Primary key(event_id)
);

CREATE TABLE Humanitarian_work(
Event_id		int not null,
hwork_name		varchar(50)  not null,
Email		varchar(50)	 not null,
Account_number	int		not null,
primary key(Event_id)
);

CREATE TABLE Offers(
Event_id		int		not null,
Drive_or_user		varchar(50)  not null Check(Drive_or_user in ('Driver', 'User')),
Percentage	int		not null,
primary key(Event_id)
);



CREATE TABLE Users(
User_id		serial		not null,
Fname		varchar(50)  not null,
Lname		varchar(50)  not null,
Phone_number		int		not null,
Email		varchar(50)		not null,
password	text	not null,
Sex			varchar(50)		not null check(Sex in('Male','Female')),
Age			int	,
Location	varchar(50),
primary key(User_id)
);

CREATE TABLE Delivery(
User_id		int		not null,
Transmission	Varchar(50)   check(Transmission in ('Manual', 'Automatic')),
Price_Km		float		not null,
Is_available		boolean 	not null,
primary key(User_id)
);

CREATE TABLE Employee(
User_id		int		not null,
Salary		int		not null,
Working_Hours		int not null,
Center_id	int,
primary key(User_id)
);

CREATE TABLE Who_drive(
    user_id int not null,
    car_id   int not null,
    primary key(user_id,car_id)
);

CREATE TABLE event_for(
    user_id int not null,
    event_id int not null,
    primary KEY(user_id,event_id)
);

-----------------------------------------------
---start--------------
ALTER TABLE competitors
ADD CONSTRAINT competitor_item_fk
FOREIGN KEY (item_id)
REFERENCES items(item_id)
on delete cascade
on update cascade;

ALTER TABLE user_trips
ADD CONSTRAINT user_trip_item_id_fk
FOREIGN KEY (item_id)
REFERENCES items(item_id)
on delete cascade
on update cascade;

ALTER TABLE competitions
ADD CONSTRAINT searched_item_item_id_fk
FOREIGN KEY (searched_item)
REFERENCES items(item_id)
on delete cascade
on update cascade;



-----------------------user_id-------------
ALTER TABLE normal_users
ADD CONSTRAINT normal_user_user_fk
FOREIGN KEY (user_id)
REFERENCES users (user_id)
on delete cascade
on update cascade;


ALTER TABLE event_for
ADD CONSTRAINT event_for_user_fk
FOREIGN KEY (user_id)
REFERENCES users (user_id)
on delete cascade
on update cascade;

ALTER TABLE notifications
ADD CONSTRAINT receiver_user_fk
FOREIGN KEY (receiver_id)
REFERENCES users (user_id)
on delete cascade
on update cascade;

ALTER TABLE employee
ADD CONSTRAINT employee_user_fk
FOREIGN KEY (user_id)
REFERENCES users (user_id)
on delete cascade
on update cascade;


ALTER TABLE delivery
ADD CONSTRAINT delivery_user_fk
FOREIGN KEY (user_id)
REFERENCES users (user_id)
on delete cascade
on update cascade;

ALTER TABLE user_trips
ADD CONSTRAINT delivery_user_fk
FOREIGN KEY (driver_id)
REFERENCES delivery (user_id)
on delete set null
on update cascade;


ALTER TABLE notifications
ADD CONSTRAINT sender_user_fk
FOREIGN KEY (sender_id)
REFERENCES employee (user_id)
on delete cascade
on update cascade;


ALTER TABLE complaints
ADD CONSTRAINT complaints_user_fk
FOREIGN KEY (user_id)
REFERENCES normal_users (user_id)
on delete cascade
on update cascade;

ALTER TABLE products
ADD CONSTRAINT products_user_fk
FOREIGN KEY (customer_id)
REFERENCES normal_users (user_id)
on delete set null
on update cascade;

ALTER TABLE competitors
ADD CONSTRAINT competitors_user_fk
FOREIGN KEY (user_id)
REFERENCES normal_users (user_id)
on delete cascade
on update cascade;

ALTER TABLE user_trips
ADD CONSTRAINT user_trip_user_fk
FOREIGN KEY (owner_id)
REFERENCES normal_users (user_id)
on delete set null
on update cascade;

ALTER TABLE items
ADD CONSTRAINT items_user_fk
FOREIGN KEY (owner_id)
REFERENCES normal_users (user_id)
on delete set null
on update cascade;

ALTER TABLE competitions
ADD CONSTRAINT manager_user_fk
FOREIGN KEY (manager_id)
REFERENCES normal_users (user_id)
on delete set null
on update cascade;

ALTER TABLE competitions
ADD CONSTRAINT winner_user_fk
FOREIGN KEY (winner_id)
REFERENCES normal_users (user_id)
on delete set null
on update cascade;


ALTER TABLE who_drive
ADD CONSTRAINT who_drive_user_fk
FOREIGN KEY (user_id)
REFERENCES delivery (user_id)
on delete cascade
on update cascade;


ALTER TABLE products
ADD CONSTRAINT products_discounts_fk
FOREIGN KEY (discount_id)
REFERENCES discounts (discount_id)
on delete set null
on update cascade;

ALTER TABLE event_for
ADD CONSTRAINT event_for_event_fk
FOREIGN KEY (event_id)
REFERENCES events (event_id)
on delete cascade
on update cascade;

ALTER TABLE offers
ADD CONSTRAINT offers_event_fk
FOREIGN KEY (event_id)
REFERENCES events (event_id)
on delete cascade
on update cascade;

ALTER TABLE Humanitarian_work
ADD CONSTRAINT hwork_event_fk
FOREIGN KEY (event_id)
REFERENCES events (event_id)
on delete cascade
on update cascade;

ALTER TABLE center_events
ADD CONSTRAINT center_events_event_fk
FOREIGN KEY (event_id)
REFERENCES events (event_id)
on delete cascade
on update cascade;

ALTER TABLE who_drive
ADD CONSTRAINT who_drive_event_fk
FOREIGN KEY (car_id)
REFERENCES cars (car_id)
on delete cascade
on update cascade;

ALTER TABLE center_events
ADD CONSTRAINT center_events_center_fk
FOREIGN KEY (center_id)
REFERENCES centers (center_id)
on delete cascade
on update cascade;

ALTER TABLE products
ADD CONSTRAINT products_center_fk
FOREIGN KEY (center_id)
REFERENCES centers (center_id)
on delete set null
on update cascade;

ALTER TABLE cars
ADD CONSTRAINT cars_center_fk
FOREIGN KEY (center_id)
REFERENCES centers (center_id)
on delete set null
on update cascade;


ALTER TABLE employee
ADD CONSTRAINT employee_center_fk
FOREIGN KEY (center_id)
REFERENCES centers (center_id)
on delete set null
on update cascade;

ALTER TABLE from_center_to_another
ADD CONSTRAINT from_center_to_another_center_fk1
FOREIGN KEY (center1_id)
REFERENCES centers (center_id)
on delete cascade
on update cascade;

ALTER TABLE from_center_to_another
ADD CONSTRAINT from_center_to_another_center_fk2
FOREIGN KEY (center2_id)
REFERENCES centers (center_id)
on delete cascade
on update cascade;

-----------------------------------editing in database---------------------------
alter table cars alter column pirce type float;
alter table cars Rename column pirce to price;

ALTER TABLE delivery
DROP CONSTRAINT IF EXISTS delivery_transmission_check;
ALTER TABLE delivery
ADD CONSTRAINT delivery_transmission_check CHECK 
(transmission IN ('Manual', 'Automatic', 'Both'));

alter table delivery add column account_number bigint;
alter table delivery add column balance float;

ALTER TABLE delivery DROP CONSTRAINT IF EXISTS delivery_transmission_check;
ALTER TABLE delivery DROP CONSTRAINT IF EXISTS transmission;
-- Adding a CHECK constraint to ensure transmission values are within the specified range
ALTER TABLE delivery ADD CONSTRAINT delivery_transmission_check CHECK (transmission IN ('Manual', 'Automatic', 'Both'));


ALTER TABLE products ADD CONSTRAINT check_typeof_product CHECK (product_type IN ('laptop', 'phone', 'glass','watch'));

alter table centers add constraint email_key unique (email);
alter table centers add constraint contactNumber_key unique (contact_number);
alter table centers add constraint accountNumber_key unique (account_number);
alter table humanitarian_work add constraint accountNumberWork_key unique (account_number);
alter table users add constraint emailuser_key unique (email);
alter table users add constraint phonenumber_key unique (phone_number);
alter table delivery add constraint deliv_account_k unique(account_number);
alter table delivery add constraint deliv_k unique(account_number);
alter table normal_users add constraint normal_k unique(account_number);


ALTER TABLE complaints
ADD CONSTRAINT complaints_user_foregin_k
FOREIGN KEY (user_id)
REFERENCES users (user_id)
on delete cascade
on update cascade;

alter table products drop column center_id;
alter table products add column center_id int references centers; 

ALTER TABLE products
ADD CONSTRAINT products_center_fk
FOREIGN KEY (center_id)
REFERENCES centers (center_id)
on delete set null
on update cascade;

alter table delivery add column drive_now boolean default false;

drop table who_drive;

alter table user_trips add column car_id integer;
alter table user_trips add constraint car_user_trip_fk foreign key(car_id) references cars(car_id) 
on update cascade on delete set null;


ALTER TABLE complaints
ADD CONSTRAINT statusCheck CHECK 
(status IN ('in_progress', 'resolved'));

alter table user_trips drop constraint delivery_user_fk;
alter table user_trips add constraint delivery_user_fk foreign key(driver_id) references delivery(user_id) 
on update cascade on delete set null;

alter table user_trips drop constraint user_trip_user_fk;
alter table user_trips add constraint user_trip_user_fk foreign key(owner_id) references normal_users(user_id) 
on update cascade on delete set null;


alter table competitions drop constraint manager_user_fk;
 alter table competitions add constraint manager_user_fk foreign key(manager_id) references normal_users(user_id)
 on update cascade on delete cascade;

 alter table employee add column is_admin boolean DEFAULT false;

alter table items drop column item_photo;

alter table centers add constraint location_key  unique(center_location);


alter table centers drop column account_number;
alter table delivery drop column account_number;
alter table normal_users drop column account_number;


 -------------------------procedures and functions----------------------
 -- PROCEDURE: public.add_user(character varying, character varying, integer, character varying, text, character varying, integer, character varying)

-- DROP PROCEDURE IF EXISTS public.add_user(character varying, character varying, integer, character varying, text, character varying, integer, character varying);

CREATE OR REPLACE PROCEDURE public.add_user(
	IN fname character varying,
	IN lname character varying,
	IN phone_number integer,
	IN email character varying,
	IN password text,
	IN sex character varying,
	IN age integer,
	IN location character varying)
LANGUAGE 'sql'
AS $BODY$
insert into users ("fname","lname","phone_number","email","password","sex","age","location") 
values(
	fname,lname,phone_number,email,password,sex,age,location
);
$BODY$;
ALTER PROCEDURE public.add_user(character varying, character varying, integer, character varying, text, character varying, integer, character varying)
    OWNER TO postgres;

-- PROCEDURE: public.add_comp(integer, character varying, date, date, character varying, double precision, integer, integer)

-- DROP PROCEDURE IF EXISTS public.add_comp(integer, character varying, date, date, character varying, double precision, integer, integer);

CREATE OR REPLACE PROCEDURE public.add_comp(
	IN searched_item integer,
	IN competition_name character varying,
	IN start_date date,
	IN end_date date,
	IN description character varying,
	IN price double precision,
	IN manager_id integer,
	IN winner_id integer)
LANGUAGE 'sql'
AS $BODY$
insert into competitions ("searched_item","competition_name","start_date","end_date","description","price","manager_id","winner_id") 
values(
	searched_item,competition_name,start_date,end_date,description,price,manager_id,winner_id
);
$BODY$;
ALTER PROCEDURE public.add_comp(integer, character varying, date, date, character varying, double precision, integer, integer)
    OWNER TO postgres;


-- PROCEDURE: public.add_center(character varying, bigint, character varying, character varying, double precision, double precision, double precision)

-- DROP PROCEDURE IF EXISTS public.add_center(character varying, bigint, character varying, character varying, double precision, double precision, double precision);

CREATE OR REPLACE PROCEDURE public.add_center(
	IN name character varying,
	IN contact_num bigint,
	IN email character varying,
	IN location character varying,
	IN rent_price double precision,
	IN opening_hours double precision,
	IN balance double precision)
LANGUAGE 'sql'
AS $BODY$
insert into centers ("center_name","contact_number","email","center_location",
	"rent_price","opening_hours","balance") values(name,contact_num,
	email,location,rent_price,opening_hours,balance)
$BODY$;
ALTER PROCEDURE public.add_center(character varying, bigint, character varying, character varying, double precision, double precision, double precision)
    OWNER TO postgres;


-- PROCEDURE: public.add_car(date, character varying, character varying, double precision, character varying, date, integer)

-- DROP PROCEDURE IF EXISTS public.add_car(date, character varying, character varying, double precision, character varying, date, integer);

CREATE OR REPLACE PROCEDURE public.add_car(
	IN registration_date date,
	IN brand character varying,
	IN model character varying,
	IN price double precision,
	IN transmission character varying,
	IN manufacturing_date date,
	IN center_id integer)
LANGUAGE 'sql'
AS $BODY$
insert into cars ("registration_date","brand","model","price",
	"transmission","manufacturing_date","center_id","is_available") values(registration_date,brand,
	model,price,transmission,manufacturing_date,center_id,true)
$BODY$;
ALTER PROCEDURE public.add_car(date, character varying, character varying, double precision, character varying, date, integer)
    OWNER TO postgres;



CREATE OR REPLACE FUNCTION public.pay(
	userid integer,
	delivid integer,
	amount numeric)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    Usercurrent_balance NUMERIC;
	Service	NUMERIC;

BEGIN
   
    SELECT balance INTO Usercurrent_balance FROM normal_users as u WHERE u.user_id = Userid;
	Service := 50;	--center service for finding the losted item
	

    IF Usercurrent_balance >= amount+Service THEN
       
        UPDATE normal_users as u SET balance = balance - amount - Service WHERE u.user_id = Userid;
		UPDATE delivery as d SET balance = balance + amount,is_available = true WHERE d.user_id = Delivid;
		UPDATE centers as c SET balance = balance + Service 
		WHERE c.center_location IN (SELECT location FROM users as u where u.user_id = userid);
																					   
        RETURN TRUE; 
    ELSE
        RETURN FALSE; 
    END IF;
END;
$BODY$;

ALTER FUNCTION public.pay(integer, integer, numeric)
    OWNER TO postgres;


-- FUNCTION: public.rent(integer, integer, numeric)

-- DROP FUNCTION IF EXISTS public.rent(integer, integer, numeric);

CREATE OR REPLACE FUNCTION public.rent(
	carid integer,
	delivid integer,
	deliv_balance numeric)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    rent_price NUMERIC;

BEGIN
   rent_price := 0;
   SELECT price into rent_price from cars where cars.car_id = carid ;

	if deliv_balance >= rent_price then
		update centers set balance = balance + s.price from(select * from cars where "car_id" = carid) 
		as s where centers.center_id = s.center_id;
 
 		update delivery set balance = balance - s.price from 
		(select * from cars as c where c.car_id = carid ) as s where delivery.user_id = delivid;
		return true;
	else
		return false;
	end if;
END;
$BODY$;

ALTER FUNCTION public.rent(integer, integer, numeric)
    OWNER TO postgres;
