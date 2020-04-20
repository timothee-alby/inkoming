CREATE VIEW api.player_states AS
SELECT
  players.room_id AS room_id,
  players.id AS player_id,
  players.created_at AS created_at,
  COUNT(turns.fold) = 0 AS standing
FROM api.players
LEFT JOIN api.turns ON turns.player_id = players.id
GROUP BY players.room_id, players.id;

ALTER TABLE api.player_states OWNER TO master;

GRANT SELECT ON TABLE api.player_states TO web_anon;
