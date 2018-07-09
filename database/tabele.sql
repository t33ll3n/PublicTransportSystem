use public_Transport_System;

create table Uporabnik (
	user_id int not null autoincrement,
	username varchar(255) not null,
	password varchar(255) not null,
	email varchar(255) not null,
	isCompany bool not null,
	PRIMARY KEY (uporabnik_id)
);

create table Linija (
	linija_id int not null autoincrement,
	linija_ime varchar(255) not null,
	isHoliday bool not null,
	isChecked bool not null,
	PRIMARY KEY (linija_id)
);

create table Postaja (
	postaja_id int not null autoincrement,
	postaja_ime varchar(255) not null,
	altitude float,
	longitude float
	isChecked bool not null,
	PRIMARY KEY (postaja_id)
);

create table Ocena_linije (
	ocena_id int not null autoincrement,
	linija_id int not null,
	uporabnik_id int not null,
	ocena bool not null,
	PRIMARY KEY (linija_id, uporabnik_id),
	FOREIGN KEY (uporabnik_id) REFERENCES Uporanik(uporabnik_id),
	FOREIGN KEY (linija_id) REFERENCES Linija (linija_id) 
);

create table Urnik (
	id int not null,
	linija_id int not null,
	zacetni_cas time not null,
	PRIMARY KEY (id),
	FOREIGN KEY (linija_id) REFERENCES linija (linija_id)
);

create table Vsebuje (
	id int not null,
	zaporedna_st int not null,
	linija_id int not null,
	postaja_id int not null,
	razdalja_do_naslednje int not null,
	PRIMARY KEY (linija_id, postaja_id),
	FOREIGN KEY (linija_id) REFERENCES Linija (linija_id),
	FOREIGN KEY (postaja_id) REFERENCES Postaja (postaja_id)
);

create table predlogi_popravkov_linija (
	popravek_id int not null,
	tip_napake varchar(255) not null,
	predlagan_popravek varchar(255) not null,
	status bool not null,
	linija_id int not null,
	PRIMARY KEY (popravek_id),
	FOREIGN KEY (linija_id) REFERENCES Linija (linija_id)
);

create table predlogi_popravkov_postaja (
	popravek_id int not null,
	tip_napake varchar(255) not null,
	predlagan_popravek varchar(255) not null,
	status bool not null,
	postaja_id int not null,
	PRIMARY KEY (popravek_id),
	FOREIGN KEY (postaja_id) REFERENCES Postaja (postaja_id)
);
