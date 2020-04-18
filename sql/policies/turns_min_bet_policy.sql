CREATE POLICY turns_min_bet_policy ON api.turns AS RESTRICTIVE USING (((bet IS NULL) OR (bet >= ( SELECT room_options.min_bet
   FROM api.room_options
  WHERE (room_options.room_id = turns.room_id)))));
