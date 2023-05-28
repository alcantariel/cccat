create schema cccat;

create table cccat.product (
  id_product integer,
  description text,
  price numeric
);

insert into cccat.product (id_product, description, price) values (1, 'A', 1000);
insert into cccat.product (id_product, description, price) values (2, 'B', 5000);
insert into cccat.product (id_product, description, price) values (3, 'C', 30);

create table cccat.coupon (
  code text,
  percentage numeric
);

insert into cccat.coupon (code, percentage) values ('VALE20', 20);