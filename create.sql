drop table cccat.coupon;
drop table cccat.product;
drop schema cccat;

create schema cccat;

create table cccat.product (
  id_product integer,
  description text,
  price numeric,
  width integer,
  height integer,
  length integer,
  weight numeric
);

insert into cccat.product (id_product, description, price, width, height, length, weight) values (1, 'A', 1000, 100, 30, 10, 3);
insert into cccat.product (id_product, description, price, width, height, length, weight) values (2, 'B', 5000, 50, 50, 50, 22);
insert into cccat.product (id_product, description, price, width, height, length, weight) values (3, 'C', 30, 10, 10, 10, 0.9);
insert into cccat.product (id_product, description, price, width, height, length, weight) values (4, 'D', 30, -10, -10, -10, -1);
insert into cccat.product (id_product, description, price, width, height, length, weight) values (5, 'E', 30, 10, 10, 10, -1);

create table cccat.coupon (
  code text,
  percentage numeric,
  expire_date timestamp
);

insert into cccat.coupon (code, percentage, expire_date) values ('VALE10', 20, '2022-01-01T00:00:00');
insert into cccat.coupon (code, percentage, expire_date) values ('VALE20', 20, '2100-01-01T00:00:00');