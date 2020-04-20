CREATE VIEW api.room_options AS
WITH
enriched_room_states AS (
  SELECT
    *,
    ARRAY_POSITION(
      standing_player_ids,
      last_standing_player_id
    ) AS last_standing_player_position
  FROM api.room_states
)

SELECT room_id,
  total_cards >= total_players AND challenger_player_id IS NULL AS can_bet,
  total_bets = 0 AS can_card,
  challenger_player_id IS NOT NULL AS can_challenge,
  COALESCE(last_bet, 0) + 1 AS min_bet,
  total_cards AS max_bet,
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
FROM enriched_room_states
;

ALTER TABLE api.room_options OWNER TO master;

GRANT SELECT ON TABLE api.room_options TO web_anon;
