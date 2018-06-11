'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')

Route.get('/', ({ request }) => {
  return { greeting: 'Hello world in JSON' }
})

Route.post('/signup', 'UserController.signup')
Route.post('/login', 'UserController.login')
Route.post('/create_game', 'GameController.createGame').middleware(['auth:jwt'])
Route.get('/fetch_games', 'GameController.getAllGames')
Route.get('/fetch_user_games', 'GameController.getAllUserGames').middleware(['auth:jwt'])
Route.get('/fetch_game/:id', 'GameController.fetchGame').middleware(['auth:jwt'])
Route.get('/games/applications', 'GameController.getGamesWithApplication').middleware(['auth:jwt'])
Route.get('/info/user/:id', 'UserController.getUserInfo')
Route.post('/games/searched', 'GameController.getSearchedGames')

Route.group(() => {
  Route.get('/me', 'UserController.me')
  Route.put('/update_profile', 'UserController.updateProfile')
  Route.put('/change_password', 'UserController.changePassword');
})
  .prefix('account')
  .middleware(['auth:jwt'])

Route.group(() => {
  Route.get('/games', 'UserController.getUserGames')
})
  .prefix('users')
  .middleware(['auth:jwt'])

Route.group(() => {
  Route.post('/request_join/', 'GameController.requestJoinGame')
  Route.post('/join/', 'GameController.joinGame')
  Route.post('/accept/', 'GameController.acceptRequest')
  Route.post('/reject/', 'GameController.rejectRequest')
  Route.put('/update/:id', 'GameController.updateGame')
  Route.post('/leave/', 'GameController.leaveGame')
  Route.delete('/delete/:id', 'GameController.deleteGame')
})
  .prefix('game')
  .middleware(['auth:jwt'])

Route.get('/game/:id', 'GameController.show')
Route.delete('/game/destroy/:id', 'GameController.destroy').middleware(['auth:jwt'])
Route.get('/:email', 'UserController.showProfile')
