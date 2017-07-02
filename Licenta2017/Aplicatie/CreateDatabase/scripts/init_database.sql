ALTER TABLE reviews DROP FOREIGN KEY FK_id;
ALTER TABLE photos DROP FOREIGN KEY FK_id_photos;

CREATE TABLE IF NOT EXISTS users (
	id VARCHAR(16),
	name VARCHAR(50),
	email VARCHAR(50),
	password VARCHAR(26)
);

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
	rating VARCHAR(4),
	website VARCHAR(500),
	PRIMARY KEY(id)
);

CREATE OR REPLACE TABLE reviews (
	id VARCHAR(30),
	author_name VARCHAR(100),
	author_email VARCHAR(100),
	profile_photo_url VARCHAR(500),
	rating VARCHAR(4),
	time INTEGER(25),
	message VARCHAR(600),
	credibility_score VARCHAR(10)
);

CREATE OR REPLACE TABLE photos (
	id VARCHAR(30),
	html_attributions VARCHAR(400),
	photo_reference VARCHAR(600)
);

ALTER TABLE reviews ADD CONSTRAINT FK_id FOREIGN KEY (id) REFERENCES restaurants(id);
ALTER TABLE photos ADD CONSTRAINT FK_id_photos FOREIGN KEY (id) REFERENCES restaurants(id);
