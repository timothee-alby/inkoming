CREATE OR REPLACE FUNCTION public.remove_card_from_player(player_id UUID)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS
$$
  DECLARE
    card_to_remove CARD;
  BEGIN
    WITH player_cards AS (
      -- get random index from player's cards array
      SELECT
        cards,
        FLOOR((RANDOM() * ARRAY_LENGTH(cards, 1))) AS idx
      FROM api.players
      WHERE players.id = player_id
    )

    -- get the card to remove
    SELECT INTO card_to_remove cards[idx]
    FROM player_cards;

    UPDATE api.players
    SET
    last_challenger_at = NOW(),
    cards =
      CASE
      WHEN card_to_remove = 'black'::CARD THEN
        -- easy: as there's one black card
        ARRAY_REMOVE(cards, 'black')
      ELSE
        -- complicated: convert the array to a string; remove the last 4 chars
        -- ('red' + separator) and convert back to string
        STRING_TO_ARRAY(
          OVERLAY(
            ARRAY_TO_STRING(cards, '|') PLACING '' FROM (
              CHAR_LENGTH(ARRAY_TO_STRING(cards, '|')) - 4
            ) FOR 4
          ),
          '|'
        )::CARD[]
      END
    WHERE id = player_id;
END
$$;

ALTER FUNCTION public.remove_card_from_player(UUID) OWNER TO master;
