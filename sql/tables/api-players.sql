CREATE TABLE api.players (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    room_id uuid NOT NULL,
    user_id uuid NOT NULL,
    nickname character varying NOT NULL CONSTRAINT name_min_length CHECK (char_length(nickname) > 0),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    cards public.card[] DEFAULT ARRAY['black'::public.card, 'red'::public.card, 'red'::public.card, 'red'::public.card] NOT NULL,
    points integer NOT NULL DEFAULT 0
);

ALTER TABLE api.players OWNER TO master;

ALTER TABLE ONLY api.players
    ADD CONSTRAINT players_pkey PRIMARY KEY (id);

ALTER TABLE ONLY api.players
    ADD CONSTRAINT players_room_id_user_id_key UNIQUE (room_id, user_id);

ALTER TABLE api.players ENABLE ROW LEVEL SECURITY;

GRANT SELECT,INSERT ON TABLE api.players TO web_anon;
