CREATE OR REPLACE TABLE restaurants (
	id VARCHAR(30) NOT NULL UNIQUE,
	name VARCHAR(100),
	address VARCHAR(100),
	lat VARCHAR(20),
	lng VARCHAR(20),
	tags VARCHAR(200),
	phone VARCHAR(15),
	opening_hours VARCHAR(300),
	reference VARCHAR(500),
	photos VARCHAR(2000),
	raiting VARCHAR(4),
	PRIMARY KEY(id)
);
