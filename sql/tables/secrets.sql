CREATE TABLE secrets (
    key character varying NOT NULL,
    value character varying NOT NULL
);

ALTER TABLE ONLY secrets ADD CONSTRAINT key_pkey PRIMARY KEY (key);

ALTER TABLE api.players OWNER TO master;
