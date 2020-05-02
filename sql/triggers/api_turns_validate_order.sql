CREATE OR REPLACE FUNCTION public.api_turns_validate_order() RETURNS TRIGGER LANGUAGE PLPGSQL SECURITY DEFINER AS $$
  DECLARE
    room_state record;
    player record;
  BEGIN
    SELECT INTO player *
    FROM api.players
    WHERE players.id = NEW.player_id;

    SELECT INTO room_state *
    FROM api.room_states
    WHERE room_states.room_id = player.room_id;

    IF room_state.next_player_id IS NULL THEN
      RAISE EXCEPTION 'api_turns_validate_order'
        USING DETAIL = 'round_has_ended';
    END IF;

    IF room_state.next_player_id <> player.id THEN
      RAISE EXCEPTION 'api_turns_validate_order'
        USING DETAIL = 'player_not_in_order';
    END IF;

    RETURN NEW;
  END
$$;

ALTER FUNCTION public.api_turns_validate_order() OWNER TO master;

CREATE TRIGGER api_turns_validate_order
BEFORE INSERT
ON api.turns
FOR EACH ROW EXECUTE FUNCTION public.api_turns_validate_order();
