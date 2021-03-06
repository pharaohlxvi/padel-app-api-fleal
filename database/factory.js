'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

// const Factory = use('Factory')

/**
  Factory.blueprint('App/Models/User', (faker) => {
    return {
      email: faker.email()
    }
  })
*/

const Factory = use('Factory')

    Factory.blueprint('App/Models/User', (faker) => {
      return {
        name: faker.first()
      }
    })

    Factory.blueprint('App/Models/Games', (faker) => {
      return {
        name: faker.first()
      }
    })

    Factory.blueprint('App/Models/game_user', (faker) => {
      return {
        brand: faker.first()
      }
    })
