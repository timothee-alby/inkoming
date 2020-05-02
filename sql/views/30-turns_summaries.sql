CREATE OR REPLACE VIEW turns_summaries AS
(
  SELECT
    turns.room_id,
    json_agg(
      (
        turns.id,
        turns.room_id,
        turns.player_id,
        turns.created_at,
        CASE WHEN turns.revealed THEN turns.card ELSE null END,
        turns.bet,
        turns.fold,
        turns.revealed
      )::api.turns
      ORDER BY turns.created_at ASC
    ) AS all_turns,
    COUNT(turns.id) AS total_turns,
    COUNT(turns.card) AS total_cards,
    (
      COUNT(turns.card)
      FILTER (WHERE turns.revealed)
    ) AS total_revealed_cards,
    (
      COUNT(turns.card)
      FILTER (WHERE turns.revealed AND turns.card = 'red')
    ) AS total_revealed_red_cards,
    (
      COUNT(turns.card)
      FILTER (WHERE turns.revealed AND turns.card = 'black')
    ) AS total_revealed_black_cards,
    COUNT(turns.bet)AS total_bets,
    max(turns.bet) AS last_bet,
    (
      array_agg(turns.player_id ORDER BY turns.created_at DESC)
    ) AS last_player_ids,
    (
      array_agg(turns.player_id ORDER BY turns.created_at DESC)
    )[1] AS last_player_id,
    (
      array_agg(turns.player_id ORDER BY turns.created_at DESC)
      FILTER (WHERE players_filtered.standing)
    ) AS last_standing_player_ids,
    (
      array_agg(turns.player_id ORDER BY turns.created_at DESC)
      FILTER (WHERE players_filtered.standing)
    )[1] AS last_standing_player_id
  FROM api.turns
  JOIN players_filtered ON players_filtered.id = turns.player_id
  GROUP BY turns.room_id
);

ALTER VIEW turns_summaries OWNER TO master; -- row-level security doesn't apply

GRANT SELECT ON TABLE turns_summaries TO web_anon;
