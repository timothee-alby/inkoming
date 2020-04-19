CREATE OR REPLACE FUNCTION public.api_turns_validate_fold() RETURNS TRIGGER LANGUAGE PLPGSQL SECURITY DEFINER AS $$
  DECLARE
    room_option record;
    player record;
  BEGIN
    IF NEW.fold IS NULL THEN
      RETURN NEW;
    END IF;

    SELECT INTO player *
    FROM api.players
    WHERE players.id = NEW.player_id;

    SELECT INTO room_option *
    FROM api.room_options
    WHERE room_options.room_id = player.room_id;

    IF NOT room_option.can_bet THEN
      RAISE EXCEPTION 'api_turns_validate_fold'
        USING DETAIL = 'turn_cannot_fold';
    END IF;

    RETURN NEW;
  END
$$;

ALTER FUNCTION public.api_turns_validate_fold() OWNER TO master;

CREATE TRIGGER api_turns_validate_fold
BEFORE INSERT OR UPDATE
ON api.turns
FOR EACH ROW EXECUTE FUNCTION public.api_turns_validate_fold();
