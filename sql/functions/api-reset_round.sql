CREATE OR REPLACE FUNCTION api.reset_round(player_id UUID)
RETURNS void
LANGUAGE PLPGSQL SECURITY DEFINER AS
$$
#variable_conflict use_variable
  DECLARE
    jwt_user_id UUID;
    room_state RECORD;
    player_state RECORD;
  BEGIN
    SELECT INTO jwt_user_id current_setting('request.jwt.claim.user_id', true)::UUID;

    SELECT INTO player_state *
    FROM api.player_states
    WHERE player_states.player_id = player_id
    AND player_states.user_id = jwt_user_id;

    IF player_state.player_id IS NULL
      OR player_state.player_id <> player_id THEN
      RAISE insufficient_privilege
        USING DETAIL = 'invalid_player_id';
    END IF;

    SELECT INTO room_state *
    FROM api.room_states
    WHERE room_states.room_id = player_state.room_id;

    IF room_state.outcome IS NULL THEN
      RAISE insufficient_privilege
        USING DETAIL = 'round_has_no_outcome';
    END IF;

    IF room_state.outcome = 'won' THEN
      UPDATE api.players
      SET points = points + 1
      WHERE players.id = room_state.challenger_player_id;
    ELSE
      PERFORM remove_card_from_player(room_state.challenger_player_id);
    END IF;

    DELETE FROM api.turns
    WHERE turns.room_id = room_state.room_id;

    -- all good; respond with 200
  END
$$;

ALTER FUNCTION api.reset_round(player_id UUID) OWNER TO master;
