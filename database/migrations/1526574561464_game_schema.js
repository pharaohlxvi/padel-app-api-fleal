'use strict'

const Schema = use('Schema')

class GameSchema extends Schema {
  up () {
    this.create('games', (table) => {
      table.increments()
      table.date('date').notNullable()
      table.string('time').notNullable()
      table.string('venue').notNullable()
      table.string('duration').nullable()
      table.boolean('need_equip').nullable()
      table.integer('price').nullable().unsigned()
      table.float('avg_level').nullable().unsigned()
      table.integer('min_num').notNullable().unsigned()
      table.integer('max_num').notNullable().unsigned()
      table.integer('curr_num').nullable().unsigned()
      table.integer('user_id').notNullable().unsigned()
      table.timestamps()
    })
  }

  down () {
    this.drop('games')
  }
}

module.exports = GameSchema

// CREATE TABLE IF NOT EXISTS `padel_app`.`events` (
//   `id` INT(11) NOT NULL AUTO_INCREMENT,
//   `date` DATETIME NOT NULL,
//   `venue` VARCHAR(80) NOT NULL,
//   `duration` INT(11) NULL DEFAULT NULL,
//   `need_equip` TINYINT(1) NULL DEFAULT NULL,
//   `price` INT(11) NULL DEFAULT NULL,
//   `avg_level` INT(11) NULL DEFAULT NULL,
//   `min_num` INT(11) NULL DEFAULT NULL,
//   `max_num` INT(11) NULL DEFAULT NULL,
//   `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
//   PRIMARY KEY (`id`),
//   INDEX `idx_date` (`date` ASC),
//   INDEX `idx_venue` (`venue` ASC),
//   INDEX `idx_level` (`avg_level` ASC))
// ENGINE = InnoDB
// DEFAULT CHARACTER SET = utf8
