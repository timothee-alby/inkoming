CREATE OR REPLACE FUNCTION public.api_turns_validate_fold() RETURNS TRIGGER LANGUAGE PLPGSQL SECURITY DEFINER AS $$
  DECLARE
    room_state record;
    player record;
  BEGIN
    IF NEW.fold IS NULL THEN
      RETURN NEW;
    END IF;

    SELECT INTO player *
    FROM api.players
    WHERE players.id = NEW.player_id;

    SELECT INTO room_state *
    FROM api.room_states
    WHERE room_states.room_id = player.room_id;

    IF NOT room_state.can_bet THEN
      RAISE EXCEPTION 'api_turns_validate_fold'
        USING DETAIL = 'turn_cannot_fold';
    END IF;

    RETURN NEW;
  END
$$;

ALTER FUNCTION public.api_turns_validate_fold() OWNER TO master;

CREATE TRIGGER api_turns_validate_fold
BEFORE INSERT
ON api.turns
FOR EACH ROW EXECUTE FUNCTION public.api_turns_validate_fold();
