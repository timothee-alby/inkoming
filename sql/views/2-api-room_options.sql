CREATE VIEW api.room_options AS
 SELECT room_states.room_id,
    (room_states.total_cards >= room_states.total_players) AS can_bet,
    (room_states.total_bets = 0) AS can_card,
    (COALESCE(room_states.last_bet, 0) + 1) AS min_bet,
    room_states.total_cards AS max_bet,
        CASE
            WHEN (room_states.last_player_id IS NOT NULL) THEN
            CASE
                WHEN (array_position(room_states.player_ids, room_states.last_player_id) = room_states.total_players) THEN room_states.player_ids[1]
                ELSE room_states.player_ids[(array_position(room_states.player_ids, room_states.last_player_id) + 1)]
            END
            ELSE room_states.player_ids[1]
        END AS next_player_id
   FROM api.room_states;

ALTER TABLE api.room_options OWNER TO master;

GRANT SELECT ON TABLE api.room_options TO web_anon;
