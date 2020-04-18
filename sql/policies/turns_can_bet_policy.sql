CREATE POLICY turns_can_bet_policy ON api.turns AS RESTRICTIVE USING (((bet IS NULL) OR ( SELECT room_options.can_bet
   FROM api.room_options
  WHERE (room_options.room_id = turns.room_id))));
