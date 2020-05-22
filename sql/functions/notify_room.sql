CREATE OR REPLACE FUNCTION public.notify_room(room_id UUID, payload RECORD)
RETURNS void
LANGUAGE plpgsql AS
$$
  BEGIN
    PERFORM PG_NOTIFY(
      'postgres-websockets-listener',
      JSON_BUILD_OBJECT(
        'channel',
        'room_' || room_id,
        'payload',
        (
          SELECT ROW_TO_JSON(payload.*)
        )
      )::text
    );
END
$$;

ALTER FUNCTION public.notify_room(UUID, RECORD) OWNER TO master;
