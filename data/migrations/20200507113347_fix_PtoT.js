
exports.up = function(knex) {
  knex.schema.alterTable('PtoT', tbl =>{
    tbl.increments();

  	tbl
  	  .string('letter')
  	  .notNullable()
  	  .unique();

      tbl.text('image').notNullable().alter();

  	  //tbl.string('image').notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("PtoT");
};
