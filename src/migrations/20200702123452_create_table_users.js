
exports.up = function(knex) {
    return knex.schema.createTable('users', table => {
        table.increments();
        table.boolean('active').default(true);
        table.boolean('admin').default(false);
        table.string('username', 15).unique();
        table.string('email').unique();
        table.string('password', 60);
        table.string('firstname');
        table.string('lastname');
        table.timestamps(false, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('users');
};