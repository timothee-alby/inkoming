CREATE TABLE api.rooms (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    name character varying
);

ALTER TABLE api.rooms OWNER TO master;

ALTER TABLE ONLY api.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);

ALTER TABLE api.rooms ENABLE ROW LEVEL SECURITY;

GRANT SELECT,INSERT ON TABLE api.rooms TO web_anon;
