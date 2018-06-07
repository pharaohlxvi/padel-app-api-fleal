'use strict'

const Schema = use('Schema')

class GameUserSchema extends Schema {
  up () {
    this.create('game_user', (table) => {
      table.increments()
      table.integer('user_id').unsigned().index('user_id')
      table.integer('game_id').unsigned().index('game_id')
      table.foreign('user_id').references('users.id').onDelete('cascade')
      table.foreign('game_id').references('games.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('game_user')
  }
}

module.exports = GameUserSchema
