CREATE OR REPLACE FUNCTION public.api_players_validate_leave() RETURNS TRIGGER LANGUAGE PLPGSQL SECURITY DEFINER AS $$
  DECLARE
    room RECORD;
    turns_count INTEGER;
  BEGIN
    SELECT *
    INTO room
    FROM api.rooms
    WHERE id = OLD.room_id;

    IF room IS NULL THEN
      -- player is being delete after the room has been deleted; let it be
      RETURN OLD;
    END IF;

    IF room.user_id = OLD.user_id THEN
      RAISE EXCEPTION 'api_players_validate_leave'
        USING DETAIL = 'room_creator_cannot_leave';
    END IF;

    SELECT count(*)
    INTO turns_count
    FROM api.turns
    WHERE turns.room_id = OLD.room_id;

    IF turns_count > 0 THEN
      RAISE EXCEPTION 'api_players_validate_leave'
        USING DETAIL = 'round_has_started';
    END IF;

    RETURN OLD;
  END
$$;

ALTER FUNCTION public.api_players_validate_leave() OWNER TO master;

CREATE TRIGGER api_players_validate_leave
BEFORE DELETE
ON api.players
FOR EACH ROW EXECUTE FUNCTION public.api_players_validate_leave();
