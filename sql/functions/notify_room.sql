CREATE OR REPLACE FUNCTION public.notify_room(room_id UUID, payload RECORD)
RETURNS void
LANGUAGE plpgsql AS
$$
  BEGIN
    IF LENGTH(payload::TEXT) > 7500 THEN
      -- PG_NOTIFY has a maximum payload size of 8,000 bytes, which can be
      -- reached when the room_state is getting big. As a workaround send
      -- a simple change notification to the client.
      SELECT TRUE AS room_state_changed
      INTO payload;
    END IF;

    PERFORM PG_NOTIFY(
      'postgres-websockets-listener',
      JSON_BUILD_OBJECT(
        'channel',
        'room_' || room_id,
        'payload',
        payload
      )::text
    );
END
$$;

ALTER FUNCTION public.notify_room(UUID, RECORD) OWNER TO master;
