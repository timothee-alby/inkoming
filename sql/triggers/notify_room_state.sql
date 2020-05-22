CREATE OR REPLACE FUNCTION public.notify_room_state() RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
  DECLARE
    payload RECORD;
  BEGIN
    SELECT
      row_to_json(room_states.*) as room_state
    INTO payload
    FROM api.room_states
    WHERE room_states.room_id = NEW.room_id;

    PERFORM notify_room(NEW.room_id, payload);

  RETURN NULL;
  END
$$;

ALTER FUNCTION public.notify_room_state() OWNER TO master;

CREATE TRIGGER notify_room_state
AFTER INSERT OR UPDATE
ON api.turns
FOR EACH ROW EXECUTE FUNCTION public.notify_room_state();

CREATE TRIGGER notify_room_state
AFTER INSERT OR UPDATE
ON api.players
FOR EACH ROW EXECUTE FUNCTION public.notify_room_state();
