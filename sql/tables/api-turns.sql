CREATE TABLE api.turns (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    room_id uuid NOT NULL,
    player_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    card public.card,
    bet integer,
    CONSTRAINT turns_card_or_bet_not_null CHECK (((card IS NOT NULL) OR (bet IS NOT NULL)))
);

ALTER TABLE api.turns OWNER TO master;

ALTER TABLE ONLY api.turns
    ADD CONSTRAINT turns_pkey PRIMARY KEY (id);

ALTER TABLE api.turns ENABLE ROW LEVEL SECURITY;

GRANT SELECT,INSERT ON TABLE api.turns TO web_anon;
