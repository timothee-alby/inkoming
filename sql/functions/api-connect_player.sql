CREATE OR REPLACE FUNCTION api.connect_player(player_id UUID)
RETURNS table (jwt TEXT)
LANGUAGE PLPGSQL SECURITY DEFINER AS
$$
#variable_conflict use_variable
  DECLARE
    jwt_user_id UUID;
    player RECORD;
    data RECORD;
  BEGIN
    SELECT INTO jwt_user_id current_setting('request.jwt.claim.user_id', true)::UUID;

    SELECT INTO player *
    FROM api.players
    WHERE players.id = player_id
    AND players.user_id = jwt_user_id;

    IF player.id IS NULL THEN
      RAISE insufficient_privilege
        USING DETAIL = 'invalid_player_id';
    END IF;

    RETURN QUERY
      WITH jwt_data AS (
        SELECT
          player.user_id AS user_id,
          player.id AS player_id,
          player.room_id AS room_id,
          'room_' || player.room_id AS channel,
          'r' AS mode
      )

      SELECT
        public.sign(
          ROW_TO_JSON(jwt_data), (SELECT value from secrets WHERE key = 'app.jwt_secret')
        ) AS jwt
      FROM jwt_data;
  END
$$;

ALTER FUNCTION api.connect_player(player_id UUID) OWNER TO master;
