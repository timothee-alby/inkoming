CREATE OR REPLACE FUNCTION api.reset_room(player_id UUID)
RETURNS void
LANGUAGE PLPGSQL SECURITY DEFINER AS
$$
#variable_conflict use_variable
  DECLARE
    jwt_user_id UUID;
    room_state RECORD;
    player RECORD;
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

    SELECT INTO room_state *
    FROM api.room_states
    WHERE room_states.room_id = player.room_id;

    IF room_state.game_winner_player_id IS NULL THEN
      RAISE insufficient_privilege
        USING DETAIL = 'room_has_not_ended';
    END IF;

    -- THEN update the players. This will trigger notify_room()
    UPDATE api.players
    SET
      cards = DEFAULT,
      points = 0
    WHERE players.room_id = room_state.room_id;

    -- all good; respond with 200
  END
$$;

ALTER FUNCTION api.reset_room(player_id UUID) OWNER TO master;
