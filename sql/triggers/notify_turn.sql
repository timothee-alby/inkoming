CREATE OR REPLACE FUNCTION public.notify_turn() RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
  DECLARE
    payload RECORD;
  BEGIN
    SELECT
      players.id AS source_player_id,
      CASE
      WHEN NEW.fold IS NOT NULL THEN
        'notification.turn.created.fold'
      WHEN NEW.bet IS NOT NULL THEN
        'notification.turn.created.bet'
      ELSE
        'notification.turn.created.card'
      END AS key,
      players.nickname AS nickname,
      NEW.bet AS bet
    INTO payload
    FROM api.players
    WHERE players.id = NEW.player_id;

    PERFORM notify_room(NEW.room_id, payload);

  RETURN NULL;
  END
$$;

ALTER FUNCTION public.notify_turn() OWNER TO master;

CREATE TRIGGER notify_turn
AFTER INSERT
ON api.turns
FOR EACH ROW EXECUTE FUNCTION public.notify_turn();
