'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')
const Game = use('App/Models/Game')

class UserController {

  // *** WORKING *** SIGNUP *** WORKING ***
  async signup ({ request, auth, response }) {
    // get user data from signup form
    const userData = request.only(['name', 'email', 'password', 'age', 'level'])
    this.formatData(userData);
    try {
        // save user to database
        const user = await User.create(userData)
        // generate JWT token for user
        const token = await auth.generate(user)

        return response.json({
            status: 'success',
            data: token
        })
    } catch (error) {
        return response.status(400).json({
            status: 'error',
            message: 'Tivemos um problema. Por favor tente novamente.'
        })
    }
  }
  formatData(userData) {
    userData.age = parseInt(userData.age);
    userData.level = parseInt(userData.level);
    userData.qty_rates = 0;
    userData.total_rates = 0
  }

  // *** WORKING *** SIGNIN *** WORKING ***
  async login ({ request, auth, response }) {
    try {
        // validate the user credentials and generate a JWT token
        const token = await auth.attempt(
            request.input('email'),
            request.input('password')
        )

        return response.json({
            status: 'success',
            data: token
        })
    } catch (error) {
        response.status(400).json({
            status: 'error',
            message: 'Tivemos um problema com seu email ou senha. Por favor tente novamente.'
        })
    }
  }

  // *** WORKING *** GET CURRENT AUTHENTICATED USER AND ITS GAMES *** WORKING ***
  async getUserGames ({ auth, response }) {
    // console.log('user getUserGames = ')
    try {
      const user = await User.query()
        .where('id', auth.current.user.id)
        .with('games')
        .with('applications')
        .firstOrFail()
        // console.log('1) user user = ' + JSON.stringify(user, null, 2))
      return response.json({
        status: 'success',
        data: user
      })
    } catch (error) {
      response.status(400).json({
          status: 'error',
          message: 'Tivemos um problema com seu email ou senha. Por favor tente novamente.'
      })
    }
  }

  // async getUserGames ({ auth, response }) {
  //   const user = await User.query()
  //     .where('id', auth.current.user.id)
  //     .with('games')
  //     // .with('applications')
  //     .firstOrFail()
  //   console.log('user.games = ' + JSON.stringify(this.user.games, null, 2))
  //   return response.json({
  //     status: 'success',
  //     data: user
  //   })
  // }

  // GETS USER INFO FROM ID
  async getUserInfo ({ params, response }) {
    try {
      const user = await User.query()
        .where('id', parseInt(params.id))
        .firstOrFail()
      return response.json({
        status: 'success',
        data: user
      })
    } catch (error) {
      response.status(400).json({
          status: 'error',
          message: 'Tivemos um problema com seu email ou senha. Por favor tente novamente.'
      })
    }
  }

  // *** WORKING *** UPDATE PROFILE *** WORKING ***
  async updateProfile ({ request, auth, response }) {
    try {
        // get currently authenticated user
        const user = auth.current.user

        // update with new data entered
        user.name = request.input('name')
        user.email = request.input('email')
        user.age = request.input('age')
        user.level = request.input('level')

        await user.save()

        return response.json({
            status: 'success',
            message: 'Perfil atualizado com sucesso!',
            data: user
        })
    } catch (error) {
        return response.status(400).json({
            status: 'error',
            message: 'Tivemos um problema atualizando seu perfil. Por favor tente novamente.'
        })
    }
  }

  // SHOW PROFILE
  // async showProfile ({ request, params, response }) {
  //   try {
  //       const user = await User.query()
  //           .where('email', params.email)
  //           .with('games')
  //           .firstOrFail()

  //       return response.json({
  //           status: 'success',
  //           data: user
  //       })
  //   } catch (error) {
  //       return response.status(404).json({
  //           status: 'error',
  //           message: 'Usu&aacute;rio n&atilde;o encontrado!'
  //       })
  //   }
  // }

  // *** WORKING *** CHANGE PASSWORD *** WORKING ***
  async changePassword ({ request, auth, response }) {
    // get currently authenticated user
    const user = auth.current.user

    // verify if current password matches
    const verifyPassword = await Hash.verify(
        request.input('password'),
        user.password
    )

    // display appropriate message
    if (!verifyPassword) {
        return response.status(400).json({
            status: 'error',
            message: 'Sua senha n&atilde;o est&aacute; correta! Por favor tente novamente.'
        })
    }

    // hash and save new password
    user.password = await Hash.make(request.input('newPassword'))
    await user.save()

    return response.json({
        status: 'success',
        message: 'Senha modificada com sucesso!'
    })
  }
}

module.exports = UserController
