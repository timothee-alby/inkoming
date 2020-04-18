CREATE POLICY turns_in_turn_policy ON api.turns AS RESTRICTIVE USING ((player_id = ( SELECT room_options.next_player_id
   FROM api.room_options
  WHERE (room_options.room_id = turns.room_id))));
