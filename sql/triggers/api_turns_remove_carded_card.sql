CREATE FUNCTION public.api_turns_remove_carded_card() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN

IF NEW.card IS NULL THEN
  RETURN NULL;
END IF;

UPDATE api.players
SET cards = (
CASE WHEN (NEW.card = 'black'::CARD)
  THEN string_to_array(
    overlay(
      array_to_string(cards, '|') placing '' FROM 1 FOR 6
    ),
    '|'
  )
  ELSE string_to_array(
    overlay(
      array_to_string(cards, '|') placing '' FROM (
        char_length(array_to_string(cards, '|')) - 4
      ) FOR 4
    ),
    '|'
  )
END
)::CARD[]
WHERE id = NEW.player_id;
RETURN NULL;
END
$$;


ALTER FUNCTION public.api_turns_remove_carded_card() OWNER TO master;

CREATE TRIGGER api_turns_after_insert_remove_carded_card AFTER INSERT ON api.turns FOR EACH ROW EXECUTE FUNCTION public.api_turns_remove_carded_card();
