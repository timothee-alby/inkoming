CREATE OR REPLACE FUNCTION api.reveal_card(player_id UUID, target_player_id UUID)
RETURNS void
LANGUAGE PLPGSQL SECURITY DEFINER AS
$$
#variable_conflict use_variable
  DECLARE
    jwt_user_id UUID;
    room_state RECORD;
    player_state RECORD;
    target_turn RECORD;
    updated_count UUID;
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

    IF room_state.outcome IS NOT NULL THEN
      RAISE insufficient_privilege
        USING DETAIL = 'round_has_outcome';
    END IF;

    IF room_state.challenger_player_id IS NULL
      OR room_state.challenger_player_id <> player_id THEN
      RAISE insufficient_privilege
        USING DETAIL = 'player_not_challenger';
    END IF;

    IF player_state.carded_cards > player_state.revealed_cards
      AND target_player_id <> player_id THEN
      RAISE insufficient_privilege
        USING DETAIL = 'player_has_unrevealed_cards';
    END IF;

    SELECT INTO target_turn *
    FROM api.turns
    WHERE turns.player_id = target_player_id
      AND turns.card IS NOT NULL
      AND NOT turns.revealed
    ORDER BY created_at DESC
    LIMIT 1;

    IF target_turn.id IS NULL THEN
      RAISE insufficient_privilege
        USING DETAIL = 'turn_not_found';
    END IF;

    UPDATE INTO updated_count api.turns
    SET revealed = true
    WHERE turns.id = target_turn.id
    RETURNING *
    ;

    -- all good; respond with 200
  END
$$;

ALTER FUNCTION api.reveal_card(player_id UUID, target_player_id UUID) OWNER TO master;
