/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  //Create vod_analysis table
  await knex.schema.createTable('vod_analysis', (table) => {
    table.increments('id').primary();
    table.text('vod_id').notNullable().unique();
    table.integer('total_duration_s').notNullable();
    table.timestamp('analysis_date').defaultTo(knex.fn.now());
    //We'll use the next two to wipe the database every day (?)
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('status').defaultTo('temporary').notNullable(); // 'temporary' or 'saved'
  });

  //Create chat_message table
  await knex.schema.createTable('chat_message', (table) => {
    table.bigIncrements('id').primary();
    table.integer('vod_analysis_id').references('id').inTable('vod_analysis').notNullable().onDelete('CASCADE');
    table.integer('time_s').notNullable();
    table.string('username', 50).notNullable();
    table.text('message').notNullable();

    // Index 1: for chronological ordering and Spike Detection
    table.index(['vod_analysis_id', 'time_s']);
  });

  //Index 2: Create the Full-Text Search Index for fast searches
  await knex.raw('CREATE INDEX idx_chat_message_fts ON chat_message USING GIN (to_tsvector(\'english\', message));');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  // Revert changes in reverse order
    return knex.schema
        .dropTableIfExists('chat_message')
        .dropTableIfExists('vod_analysis');
};
