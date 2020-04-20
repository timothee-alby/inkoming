CREATE VIEW api.player_states AS
SELECT
  players.id AS player_id,
  players.room_id AS room_id,
  players.user_id AS user_id,
  players.created_at AS created_at,
  COUNT(turns.fold) = 0 AS standing,
  COUNT(turns.card) AS carded_cards,
  (
    COUNT(turns.card)
    FILTER (WHERE turns.revealed)
  ) AS revealed_cards
FROM api.players
LEFT JOIN api.turns ON turns.player_id = players.id
GROUP BY players.room_id, players.id;

ALTER TABLE api.player_states OWNER TO master;

GRANT SELECT ON TABLE api.player_states TO web_anon;
