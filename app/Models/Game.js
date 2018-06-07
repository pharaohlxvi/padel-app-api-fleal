'use strict'

const Model = use('Model')

class Game extends Model {

  // DATE FORMAT from the form (Lucid) = 2018-06-01T03:00:00.000Z
  // DATE FORMAT displayed from search (SQL) = 2026-05-18 20:00:00

  // Defining date fields
  static get dates () {
    return super.dates.concat(['date'])
  }

  // // Formatting date fields
  // static formatDates (field, value) {
  //   if (field === 'date') {
  //     return value.format()
  //   }
  //   return super.formatDates(field, value)
  // }

  // // Casting dates
  // static castDates (field, value) {
  //   if (field === 'date') {
  //     return value.format('YYYY-MM-DD')
  //   }
  //   return super.formatDates(field, value)
  // }

  users () {
    return this.belongsToMany(
      'App/Models/User',
      'game_id',
      'user_id'
    ).pivotTable('game_user')
  }

  applicants () {
    return this.belongsToMany(
      'App/Models/User',
      'game_id',
      'applicant_id'
    ).pivotModel('App/Models/Application')
  }

}

module.exports = Game
