CREATE OR REPLACE FUNCTION public.api_turns_validate_card() RETURNS TRIGGER LANGUAGE PLPGSQL SECURITY DEFINER AS $$
  DECLARE
    room_option record;
    player record;
  BEGIN
    IF NEW.card IS NULL THEN
      RETURN NEW;
    END IF;

    SELECT INTO player *
    FROM api.players
    WHERE players.id = NEW.player_id;

    SELECT INTO room_option *
    FROM api.room_options
    WHERE room_options.room_id = player.room_id;

    IF room_option.can_card <> TRUE THEN
      RAISE EXCEPTION 'api_turns_validate_card'
        USING DETAIL = 'turn_cannot_card';
    END IF;

    IF NOT NEW.card = ANY(player.cards) THEN
      RAISE EXCEPTION 'api_turns_validate_card'
        USING DETAIL = 'player_does_not_have_card';
    END IF;

    RETURN NEW;
  END
$$;

ALTER FUNCTION public.api_turns_validate_card() OWNER TO master;

CREATE TRIGGER api_turns_validate_card
BEFORE INSERT
ON api.turns
FOR EACH ROW EXECUTE FUNCTION public.api_turns_validate_card();
