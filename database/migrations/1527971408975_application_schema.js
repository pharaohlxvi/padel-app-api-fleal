'use strict'

const Schema = use('Schema')

class ApplicationSchema extends Schema {
  up () {
    this.create('applications', (table) => {
      table.increments()
      table.integer('applicant_id').unsigned().notNullable()
      table.integer('game_id').unsigned().notNullable()
      table.timestamps()
      table.foreign('applicant_id').references('users.id').onDelete('cascade')
      table.foreign('game_id').references('games.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('applications')
  }
}

module.exports = ApplicationSchema
