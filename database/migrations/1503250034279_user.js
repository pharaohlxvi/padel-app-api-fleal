'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', table => {
      table.increments()
      table.string('name').notNullable()
      table.string('email').notNullable().unique()
      table.string('password').notNullable()
      table.integer('age').nullable().unsigned()
      table.integer('level').nullable().unsigned()
      table.integer('qty_rates').nullable().unsigned()
      table.integer('total_rates').nullable().unsigned()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema

// CREATE TABLE IF NOT EXISTS `padel_app`.`users` (
//   `id` INT(11) NOT NULL AUTO_INCREMENT,
//   `name` VARCHAR(80) NOT NULL,
//   `email` VARCHAR(100) NOT NULL,
//   `password` VARCHAR(45) NOT NULL,
//   `age` INT(11) NULL DEFAULT NULL,
//   `level` VARCHAR(16) NOT NULL,
//   `qty_rates` INT(11) NULL DEFAULT NULL,
//   `total_rates` INT(11) NULL DEFAULT NULL,
//   `total_games` INT(11) NULL DEFAULT NULL,
//   `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
//   PRIMARY KEY (`id`))
// ENGINE = InnoDB
// DEFAULT CHARACTER SET = utf8
