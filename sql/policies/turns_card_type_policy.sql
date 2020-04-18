CREATE POLICY turns_card_type_policy ON api.turns USING (((card IS NULL) OR (card = ANY (ARRAY['red'::public.card, 'black'::public.card]))));
