CREATE OR REPLACE FUNCTION public.api_turns_validate_card() RETURNS TRIGGER LANGUAGE PLPGSQL SECURITY DEFINER AS $$
  DECLARE
    room_state record;
    player record;
    total_cards_of_type integer;
    total_cards_of_type_used integer;
  BEGIN
    IF NEW.card IS NULL THEN
      RETURN NEW;
    END IF;

    SELECT INTO player *
    FROM api.players
    WHERE players.id = NEW.player_id;

    SELECT INTO room_state *
    FROM api.room_states
    WHERE room_states.room_id = player.room_id;

    IF room_state.can_card <> TRUE THEN
      RAISE EXCEPTION 'api_turns_validate_card'
        USING DETAIL = 'turn_cannot_card';
    END IF;

    total_cards_of_type =
      ARRAY_LENGTH(ARRAY_POSITIONS(player.cards, NEW.card), 1);

    IF total_cards_of_type < 1 THEN
      RAISE EXCEPTION 'api_turns_validate_card'
        USING DETAIL = 'player_does_not_have_card';
    END IF;

    SELECT INTO total_cards_of_type_used COUNT(*)
    FROM api.turns
    WHERE turns.player_id = NEW.player_id
      AND turns.card = NEW.card;

    IF total_cards_of_type - total_cards_of_type_used < 1 THEN
      RAISE EXCEPTION 'api_turns_validate_card'
        USING DETAIL = 'player_does_not_have_card_available';
    END IF;

    RETURN NEW;
  END
$$;

ALTER FUNCTION public.api_turns_validate_card() OWNER TO master;

CREATE TRIGGER api_turns_validate_card
BEFORE INSERT
ON api.turns
FOR EACH ROW EXECUTE FUNCTION public.api_turns_validate_card();
