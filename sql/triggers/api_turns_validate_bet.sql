CREATE OR REPLACE FUNCTION public.api_turns_validate_bet() RETURNS TRIGGER LANGUAGE PLPGSQL SECURITY DEFINER AS $$
  DECLARE
    room_option record;
    player record;
  BEGIN
    IF NEW.bet IS NULL THEN
      RETURN NEW;
    END IF;

    SELECT INTO player *
    FROM api.players
    WHERE players.id = NEW.player_id;

    SELECT INTO room_option *
    FROM api.room_options
    WHERE room_options.room_id = player.room_id;

    IF room_option.can_bet <> TRUE THEN
      RAISE EXCEPTION 'api_turns_validate_bet'
        USING DETAIL = 'turn_cannot_bet';
    END IF;

    IF NEW.bet > room_option.max_bet THEN
      RAISE EXCEPTION 'api_turns_validate_bet'
        USING DETAIL = 'bet_too_high';
    END IF;

    IF NEW.bet < room_option.min_bet THEN
      RAISE EXCEPTION 'api_turns_validate_bet'
        USING DETAIL = 'bet_too_low';
    END IF;

    RETURN NEW;
  END
$$;

ALTER FUNCTION public.api_turns_validate_bet() OWNER TO master;

CREATE TRIGGER api_turns_validate_bet
BEFORE INSERT
ON api.turns
FOR EACH ROW EXECUTE FUNCTION public.api_turns_validate_bet();
