'use strict'

const Model = use('Model')

class Application extends Model {

  user() {
    return this.belongsTo('App/Models/User');
  }

  game() {
    return this.belongsTo('App/Models/Game');
  }
}

module.exports = Application
