CREATE OR REPLACE TABLE restaurants (
	id VARCHAR(30) NOT NULL UNIQUE,
	name VARCHAR(30),
	address VARCHAR(50),
	lat VARCHAR(20),
	lng VARCHAR(20),
	tags VARCHAR(50),
	description VARCHAR(250),
	PRIMARY KEY(id)
);
