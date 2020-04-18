CREATE OR REPLACE FUNCTION public.api_turns_validate_order() RETURNS TRIGGER LANGUAGE PLPGSQL SECURITY DEFINER AS $$
  DECLARE
    room_option record;
    player record;
  BEGIN
    SELECT INTO player *
    FROM api.players
    WHERE players.id = NEW.player_id;

    SELECT INTO room_option *
    FROM api.room_options
    WHERE room_options.room_id = player.room_id;

    IF room_option.next_player_id <> player.id THEN
      RAISE EXCEPTION 'api_turns_validate_order'
        USING DETAIL = 'player_not_in_order';
    END IF;

    RETURN NEW;
  END
$$;

ALTER FUNCTION public.api_turns_validate_order() OWNER TO master;

CREATE TRIGGER api_turns_validate_order
BEFORE INSERT OR UPDATE
ON api.turns
FOR EACH ROW EXECUTE FUNCTION public.api_turns_validate_order();
