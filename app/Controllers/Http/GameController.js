'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')
const Game = use('App/Models/Game')
const Application = use('App/Models/Application')

class GameController {

  // *** WORKING *** CREATE GAME *** WORKING ***
  async createGame ({ request, auth, response }) {
    // get currently authenticated user
    const user = auth.current.user
    // get user data from createGame form
    const gameData = request.only(['date', 'time', 'venue', 'duration', 'price', 'max_num', 'need_equip'])
    this.formatObj(gameData, user.level, user.id)
    try {
      // Save game to database
      const newGame = await Game.create(gameData)
      await user.games().attach([newGame.id])
      return response.json({
        status: 'success',
        message: 'Jogo criado!',
        data: newGame
      })
    } catch (error) {
        return response.status(400).json({
            status: 'error',
            message: 'Tivemos um problema. Por favor tente novamente.'
        })
    }
  }
  formatObj(gameData, userLevel, userId) {
    // gameData.need_equip = 1,
    gameData.avg_level = userLevel,
    gameData.min_num = 4,
    gameData.max_num = parseInt(gameData.max_num),
    gameData.curr_num = 1
    gameData.user_id = userId
  }

  // *** WORKING *** GET ALL USER GAMES *** WORKING ***
  async getAllUserGames ({ auth, response }) {
    const allUserGames = await Game.query()
      .where('user_id', auth.current.user.id)
    return response.json({
      status: 'success',
      data: allUserGames
    })
  }

  // FETCH GAME
  async fetchGame ({ request, auth, params, response }) {
    try {
      const user = auth.current.user

      const game = await Game.query()
        .where('id', params.id)
        .with('users')
        .firstOrFail()
      return response.json({
        status: 'success',
        data: game
      })

    } catch (error) {
      return response.status(400).json({
          status: 'error',
          message: 'Tivemos um problema atualizando seu jogo. Por favor tente novamente.'
      })
    }
  }

  async getSearchedGames ({ request, response }) {
    const searchTerm = request.only(['venue', 'date', 'price'])
    searchTerm.venue = '%'+searchTerm.venue+'%'
    searchTerm.price = '%'+searchTerm.price+'%'
    if (!searchTerm.date) {
      searchTerm.date = '%'
    }
    try {
      var games = await Game.query()
        .whereRaw('venue LIKE ?', searchTerm.venue)
        .whereRaw('date LIKE ?', searchTerm.date)
        .whereRaw('price LIKE ?', searchTerm.price)
        .with('applicants')
        .fetch()
      return response.json({
        status: 'success',
        data: games
      })
    } catch (error) {
      response.status(400).json({
          status: 'error',
          message: 'Tivemos um problema com sua busca. Por favor tente novamente.'
      })
    }
  }

  // GET GAMES WITH APPLICATIONS
  async getGamesWithApplication ({ request, auth, response }) {
    const user = auth.current.user
    try {
      const applics = await Application.all()
      return response.json({
        status: 'success',
        data: applics
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: 'Tivemos um problema. Por favor tente novamente.'
      })
    }
  }

  // UPDATE GAME
  async updateGame ({ request, auth, params, response }) {
    try {
        // get currently authenticated user
        const user = auth.current.user

        const game = await Game.query()
          .where('id', params.id)
          .where('user_id', user.id)
          .firstOrFail()

        // update with new data entered
        game.date = request.input('date')
        game.time = request.input('time')
        game.venue = request.input('venue')
        game.duration = request.input('duration')
        game.need_equip = request.input('need_equip')
        game.price = request.input('price')
        game.max_num = request.input('max_num')

        await game.save()

        return response.json({
            status: 'success',
            message: 'Jogo atualizado com sucesso!',
            data: game
        })
    } catch (error) {
        return response.status(400).json({
            status: 'error',
            message: 'Tivemos um problema atualizando seu jogo. Por favor tente novamente.'
        })
    }
  }

  // *** WORKING *** JOIN GAME *** WORKING ***
  async joinGame ({ request, auth, response }) {
    // get currently authenticated user
    const user = auth.current.user
    const game = await Game.query()
      .where('id', request.input('game_id'))
      .firstOrFail()
    game.merge({
      avg_level: (((game.avg_level * game.curr_num) + user.level) / (game.curr_num + 1)),
      curr_num: game.curr_num + 1
    })
    await game.save()
    await user.games().attach(request.input('game_id'))
    return response.json({
      status: 'success',
      data: game
    })
  }

  // *** WORKING *** LEAVE GAME *** WORKING ***
  async leaveGame ({ request, auth, response }) {
    // get currently authenticated user
    const user = auth.current.user

    const game = await Game.query()
      .where('id', request.input('game_id'))
      .firstOrFail()
    let newAvg
    game.curr_num === 1 ? newAvg = 0 : newAvg = (((game.avg_level * game.curr_num) - user.level) / (game.curr_num - 1))
    game.merge({
      avg_level: newAvg,
      curr_num: game.curr_num - 1
    })
    await game.save()
    // remove from user's games
    await user.games().detach(request.input('game_id'))
    return response.json({
        status: 'success',
        data: null
    })
  }

  // REQUEST TO JOIN A GAME
  async requestJoinGame ({ request, auth, response }) {
    try {
      const user = await User.query()
        .where('id', auth.current.user.id)
        .with('applications')
        .firstOrFail()
      const game = await Game.query()
        .where('id', request.input('game_id'))
        .with('applicants')
        .firstOrFail()
      game.merge({
        curr_num: game.curr_num + 1
      })
      await game.save()
      await user.applications().attach(game.id)
      return response.json({
        status: 'success',
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: 'Tivemos um problema atualizando seu jogo. Por favor tente novamente.'
      })
    }
  }

  async acceptRequest ({ request, auth, response }) {
    const user = await User.query()
      .where('id', request.input('user_id'))
      .with('applications')
      .firstOrFail()
    const game = await Game.query()
      .where('id', request.input('game_id'))
      .firstOrFail()
    game.merge({
      avg_level: (((game.avg_level * game.curr_num) + user.level) / (game.curr_num + 1))
    })
    await game.save()
    await user.games().attach(request.input('game_id'))
    await user.applications().detach(request.input('game_id'))
    return response.json({
      status: 'success',
      data: game
    })
  }

  async rejectRequest ({ request, auth, response }) {
    const user = await User.query()
      .where('id', request.input('user_id'))
      .with('applications')
      .firstOrFail()
    const game = await Game.query()
      .where('id', request.input('game_id'))
      .firstOrFail()
    game.merge({
      curr_num: game.curr_num - 1
    })
    await game.save()
    await user.games().detach(request.input('game_id'))
    await user.applications().detach(request.input('game_id'))
    return response.json({
      status: 'success',
      data: game
    })
  }

  // DELETE GAME
  async deleteGame ({ request, auth, params, response }) {
    // get currently authenticated user
    const user = auth.current.user
    // get game with the specified ID
    const game = await Game.query()
        .where('id', params.id)
        .where('user_id', user.id)
        .firstOrFail()

    await game.delete()

    return response.json({
        status: 'success',
        message: 'Jogo apagado!',
        data: null
    })
  }
}

module.exports = GameController
