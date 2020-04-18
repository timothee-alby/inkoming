CREATE POLICY turns_player_id_policy ON api.turns USING ((player_id IN ( SELECT players.id
   FROM api.players
  WHERE ((players.user_id)::text = current_setting('request.jwt.claim.user_id'::text, true)))));
