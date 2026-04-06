import type { Kysely } from "kysely"
import { sql } from "kysely"

export async function up(db: Kysely<unknown>) {
	await sql`
		CREATE OR REPLACE FUNCTION set_updated_at () RETURNS TRIGGER AS $$
			BEGIN
				NEW.updated_at = current_timestamp;
				RETURN NEW;
			END;
		$$ LANGUAGE plpgsql;
	`.execute(db)
}

export async function down(db: Kysely<unknown>) {
	await sql`DROP FUNCTION IF EXISTS set_updated_at`.execute(db)
}

