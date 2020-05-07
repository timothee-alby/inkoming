CREATE OR REPLACE VIEW players_filtered AS
(
  SELECT
    players.id AS id,
    players.room_id AS room_id,
    players.user_id AS user_id,
    players.nickname AS nickname,
    players.created_at AS created_at,
    (
      COALESCE(ARRAY_LENGTH(players.cards, 1), 0) > 0
      AND COUNT(turns.fold) = 0
    ) AS standing,
    ARRAY_LENGTH(players.cards, 1) AS total_cards,
    COUNT(turns.card) AS carded_cards,
    (
      COUNT(turns.card)
      FILTER (WHERE turns.revealed)
    ) AS revealed_cards,
    players.points AS points
  FROM api.players
  LEFT JOIN api.turns ON turns.player_id = players.id
  GROUP BY players.room_id, players.id
  ORDER BY players.created_at
);

ALTER VIEW players_filtered OWNER TO master; -- row-level security doesn't apply

GRANT SELECT ON TABLE players_filtered TO web_anon;
