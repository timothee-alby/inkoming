CREATE OR REPLACE FUNCTION api.reset_round(player_id UUID)
RETURNS void
LANGUAGE PLPGSQL SECURITY DEFINER AS
$$
#variable_conflict use_variable
  DECLARE
    jwt_user_id UUID;
    room_state RECORD;
    player RECORD;
    notification_payload RECORD;
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

    IF room_state.outcome IS NULL THEN
      RETURN; -- accept as a noop
    END IF;

    -- delete all turns first
    DELETE FROM api.turns
    WHERE turns.room_id = room_state.room_id;

    -- THEN update the challenger player. This will trigger notify_room()
    IF room_state.outcome = 'won' THEN
      UPDATE api.players
      SET points = points + 1, last_challenger_at = NOW()
      WHERE players.id = room_state.challenger_player_id;
    ELSE
      PERFORM remove_card_from_player(room_state.challenger_player_id);
    END IF;

    SELECT
      player.id AS source_player_id,
      'notification.round.reset' AS key,
      player.nickname AS nickname
    INTO notification_payload;

    PERFORM notify_room(player.room_id, notification_payload);

    -- all good; respond with 200
  END
$$;

ALTER FUNCTION api.reset_round(player_id UUID) OWNER TO master;
