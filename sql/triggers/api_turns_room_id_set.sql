CREATE FUNCTION public.api_turns_room_id_set() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
SELECT INTO NEW.room_id players.room_id
FROM api.players
WHERE players.id = NEW.player_id;
RETURN NEW;
END
$$;

ALTER FUNCTION public.api_turns_room_id_set() OWNER TO master;

CREATE TRIGGER b_default BEFORE INSERT ON api.turns FOR EACH ROW EXECUTE FUNCTION public.api_turns_room_id_set();
