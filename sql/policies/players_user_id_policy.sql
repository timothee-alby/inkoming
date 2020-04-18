CREATE POLICY players_user_id_policy ON api.players AS RESTRICTIVE USING (((user_id)::text = current_setting('request.jwt.claim.user_id'::text, true)));
