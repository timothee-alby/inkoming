CREATE TABLE api.turns (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    room_id uuid NOT NULL,
    player_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    card public.card,
    bet integer,
    fold boolean,
    revealed boolean DEFAULT false,
    CONSTRAINT turns_only_card_or_bet_or_fold CHECK (
      (
        CASE WHEN card IS NULL THEN 0 ELSE 1 END
        + CASE WHEN bet IS NULL THEN 0 ELSE 1 END
        + CASE WHEN fold IS NULL THEN 0 ELSE 1 END
      ) = 1
    )
);

ALTER TABLE api.turns OWNER TO master;

ALTER TABLE ONLY api.turns
    ADD CONSTRAINT turns_pkey PRIMARY KEY (id);

ALTER TABLE api.turns ENABLE ROW LEVEL SECURITY;

GRANT SELECT,INSERT ON TABLE api.turns TO web_anon;
