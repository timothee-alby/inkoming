CREATE POLICY turns_can_card_policy ON api.turns AS RESTRICTIVE USING (((card IS NULL) OR ( SELECT room_options.can_card
   FROM api.room_options
  WHERE (room_options.room_id = turns.room_id))));
