CREATE OR REPLACE VIEW players_summaries AS
(
  SELECT
    room_id,
    json_agg(players_filtered.*) AS all_players,
    COUNT(DISTINCT id) AS total_players,
    (
      COUNT(DISTINCT id)
      FILTER (WHERE standing)
    ) AS total_standing_players,
    (
      array_agg(
        id
        ORDER BY created_at, id
      )
      FILTER (WHERE id IS NOT NULL)
    ) AS player_ids,
    (
      array_agg(
        id
        ORDER BY created_at, id
      )
      FILTER (WHERE standing)
    ) AS standing_player_ids,
    (
      COUNT(DISTINCT id)
      FILTER (WHERE total_cards > 0)
    ) AS total_players_with_cards,
    (
      ARRAY_AGG(id)
      FILTER (WHERE points > 1)
    ) AS game_winner_by_points_player_ids,
    (
      ARRAY_AGG(
        id
        ORDER BY last_challenger_at DESC NULLS LAST, created_at ASC
      )
    ) AS next_first_player_ids
  FROM players_filtered
  GROUP BY room_id
);

ALTER VIEW players_summaries OWNER TO master; -- row-level security doesn't apply

GRANT SELECT ON TABLE players_summaries TO web_anon;
