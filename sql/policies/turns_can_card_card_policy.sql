CREATE POLICY turns_can_card_card_policy ON api.turns AS RESTRICTIVE USING (((card IS NULL) OR ( SELECT (turns.card = ANY (players.cards))
   FROM api.players
  WHERE (players.id = turns.player_id))));
