CREATE VIEW api.room_states AS
WITH
all_rooms AS (
  SELECT
    rooms.id AS room_id,
    COUNT(DISTINCT player_states.player_id) AS total_players,
    (
      COUNT(DISTINCT player_states.player_id)
      FILTER (WHERE player_states.standing)
    ) AS total_standing_players,
    (
      array_agg(
        player_states.player_id
        ORDER BY player_states.created_at, player_states.player_id
      )
      FILTER (WHERE player_states.player_id IS NOT NULL)
    ) AS player_ids,
    (
      array_agg(
        player_states.player_id
        ORDER BY player_states.created_at, player_states.player_id
      )
      FILTER (WHERE player_states.standing)
    ) AS standing_player_ids
  FROM api.rooms
  LEFT JOIN api.player_states ON rooms.id = player_states.room_id
  GROUP BY rooms.id
),

turns_summaries AS (
  SELECT
    turns.room_id,
    count(turns.id) AS total_turns,
    count(turns.card) AS total_cards,
    (
      COUNT(turns.card)
      FILTER (WHERE turns.revealed)
    ) AS total_revealed_cards,
    count(turns.bet) AS total_bets,
    max(turns.bet) AS last_bet,
    (
      array_agg(turns.player_id ORDER BY turns.created_at DESC)
    ) AS last_player_ids,
    (
      array_agg(turns.player_id ORDER BY turns.created_at DESC)
    )[1] AS last_player_id,
    (
      array_agg(turns.player_id ORDER BY turns.created_at DESC)
      FILTER (WHERE player_states.standing)
    ) AS last_standing_player_ids,
    (
      array_agg(turns.player_id ORDER BY turns.created_at DESC)
      FILTER (WHERE player_states.standing)
    )[1] AS last_standing_player_id
  FROM api.turns turns
  JOIN api.player_states USING(player_id)
  GROUP BY turns.room_id
)

SELECT
  *,
  CASE
  WHEN last_bet = total_cards OR total_standing_players = 1 THEN
   last_standing_player_id
  ELSE
    NULL
  END AS challenger_player_id
FROM all_rooms
LEFT JOIN turns_summaries USING (room_id)
;

ALTER TABLE api.room_states OWNER TO master;

GRANT SELECT ON TABLE api.room_states TO web_anon;
