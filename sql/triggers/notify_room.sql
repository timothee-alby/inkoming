CREATE OR REPLACE FUNCTION public.notify_room() RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
  DECLARE
    payload RECORD;
  BEGIN
    SELECT
      'STATE' as type,
      row_to_json(room_states.*) as data
    INTO payload
    FROM api.room_states
    WHERE room_states.room_id = NEW.room_id;

    PERFORM PG_NOTIFY(
      'postgres-websockets-listener',
      JSON_BUILD_OBJECT(
        'channel',
        'room_' || NEW.room_id,
        'payload',
        (
          SELECT ROW_TO_JSON(payload.*)
        )
      )::text
    );

  RETURN NULL;
  END
$$;

ALTER FUNCTION public.notify_room() OWNER TO master;

CREATE TRIGGER notify_room
AFTER INSERT OR UPDATE
ON api.turns
FOR EACH ROW EXECUTE FUNCTION public.notify_room();

CREATE TRIGGER notify_room
AFTER INSERT OR UPDATE
ON api.players
FOR EACH ROW EXECUTE FUNCTION public.notify_room();
