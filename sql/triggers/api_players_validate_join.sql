CREATE OR REPLACE FUNCTION public.api_players_validate_join() RETURNS TRIGGER LANGUAGE PLPGSQL SECURITY DEFINER AS $$
  DECLARE
    turns_count INTEGER;
  BEGIN
    SELECT count(*)
    INTO turns_count
    FROM api.turns
    WHERE turns.room_id = NEW.room_id;

    IF turns_count > 0 THEN
      RAISE EXCEPTION 'api_players_validate_join'
        USING DETAIL = 'round_has_started';
    END IF;

    RETURN NEW;
  END
$$;

ALTER FUNCTION public.api_players_validate_join() OWNER TO master;

CREATE TRIGGER api_players_validate_join
BEFORE INSERT
ON api.players
FOR EACH ROW EXECUTE FUNCTION public.api_players_validate_join();
