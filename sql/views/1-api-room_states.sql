CREATE VIEW api.room_states AS
 SELECT rooms.id AS room_id,
    ARRAY( SELECT sub_players.id
           FROM api.players sub_players
          WHERE (sub_players.room_id = rooms.id)
          ORDER BY sub_players.created_at, sub_players.id) AS player_ids,
    count(ordered_turns.id) AS total_turns,
    count(DISTINCT players.id) AS total_players,
    count(ordered_turns.card) AS total_cards,
    count(ordered_turns.bet) AS total_bets,
    max(ordered_turns.bet) AS last_bet,
    (array_agg(ordered_turns.player_id))[1] AS last_player_id
   FROM ((api.rooms
     LEFT JOIN api.players ON ((players.room_id = rooms.id)))
     LEFT JOIN (
       SELECT *
       FROM api.turns
       ORDER BY turns.created_at DESC
     ) ordered_turns ON ordered_turns.player_id = players.id
  GROUP BY rooms.id;

ALTER TABLE api.room_states OWNER TO master;

GRANT SELECT ON TABLE api.room_states TO web_anon;
