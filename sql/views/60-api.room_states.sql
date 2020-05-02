CREATE OR REPLACE VIEW api.room_states AS
WITH
enriched_room_states_1 AS (
  SELECT
    players_summaries.room_id,
    all_players,
    all_turns,
    total_players ,
    total_standing_players ,
    player_ids,
    standing_player_ids,
    total_turns ,
    total_cards ,
    total_revealed_cards ,
    total_revealed_red_cards ,
    total_revealed_black_cards ,
    total_bets ,
    last_bet,
    last_player_ids,
    last_player_id,
    last_standing_player_ids,
    last_standing_player_id,
    CASE
    WHEN last_bet = total_cards OR total_standing_players = 1 THEN
     last_standing_player_id
    ELSE
      NULL
    END AS challenger_player_id,
    CASE
    WHEN total_revealed_black_cards > 0 THEN
      'lost'::OUTCOME
    WHEN total_revealed_red_cards = last_bet THEN
      'won'::OUTCOME
    END AS outcome,
    ARRAY_POSITION(
      standing_player_ids,
      last_standing_player_id
    ) AS last_standing_player_position
  FROM players_summaries
  LEFT JOIN turns_summaries USING (room_id)
),

enriched_room_states_2 AS (
  SELECT
    enriched_room_states_1.room_id,
    all_players,
    all_turns,
    COALESCE(total_players, 0) AS total_players,
    COALESCE(total_standing_players, 0) AS total_standing_players,
    player_ids,
    standing_player_ids,
    COALESCE(total_turns, 0) AS total_turns,
    COALESCE(total_cards, 0) AS total_cards,
    COALESCE(total_revealed_cards, 0) AS total_revealed_cards,
    COALESCE(total_revealed_red_cards, 0) AS total_revealed_red_cards,
    COALESCE(total_revealed_black_cards, 0) AS total_revealed_black_cards,
    COALESCE(total_bets, 0) AS total_bets,
    last_bet,
    last_player_ids,
    last_player_id,
    last_standing_player_ids,
    last_standing_player_id,
    challenger_player_id,
    outcome,
    last_standing_player_position,
    (
      total_cards IS NOT NULL
      AND total_cards >= total_players
      AND challenger_player_id IS NULL
    ) AS can_bet,
    total_bets IS NULL OR total_bets = 0 AS can_card,
    challenger_player_id IS NOT NULL AS can_challenge,
    COALESCE(last_bet, 0) + 1 AS min_bet,
    COALESCE(total_cards, 0) AS max_bet,
    CASE
    WHEN challenger_player_id IS NOT NULL THEN
      -- challenge mode has started
      NULL
    WHEN last_standing_player_id IS NULL THEN
      -- no player has played yet. First player is next
      standing_player_ids[1]
    WHEN total_standing_players = 1 THEN
      -- only one player left. No next player
      NULL
    ELSE
      -- next user in turn goes next
      CASE
      WHEN last_standing_player_position = total_standing_players THEN
        -- last player is last in turn. First player goes next
        standing_player_ids[1]
      ELSE
        -- last player is not last in turn. Next player in turn goes next
        standing_player_ids[(last_standing_player_position + 1)]
      END
    END AS next_player_id
    FROM enriched_room_states_1
  )

  SELECT
    players.room_id,
    all_players,
    all_turns,
    total_players,
    total_standing_players,
    player_ids,
    standing_player_ids,
    total_turns,
    total_cards,
    total_revealed_cards,
    total_revealed_red_cards,
    total_revealed_black_cards,
    total_bets,
    last_bet,
    last_player_ids,
    last_player_id,
    last_standing_player_ids,
    last_standing_player_id,
    challenger_player_id,
    outcome,
    last_standing_player_position,
    can_bet,
    can_card,
    can_challenge,
    min_bet,
    max_bet,
    next_player_id
  FROM api.rooms -- to enforce row-level policy
  JOIN api.players ON players.room_id = rooms.id -- to get resource embedding
  JOIN enriched_room_states_2 ON rooms.id = enriched_room_states_2.room_id
  ;

ALTER VIEW api.room_states OWNER TO web_anon;

GRANT SELECT ON TABLE api.room_states TO web_anon;
