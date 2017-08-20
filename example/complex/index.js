var html = require('choo/html')
var choo = require('choo')
var MixedList = require('./mixed-list')
var shuffleArray = require('fy-shuffle')

var app = choo()
app.use(tweetStore)
app.route('/', mainView)
if (typeof window !== 'undefined') {
  var container = document.createElement('div')
  container.id = 'container'
  document.body.appendChild(container)
  app.mount('#container')
}

var list = new MixedList()

function mainView (state, emit) {
  return html`
    <div id="container">
      <div>
        <button onclick=${ev => emit('shuffle-urls')}>shuffle urls</button>
        <button onclick=${ev => emit('reverse-urls')}>reverse urls</button>
        <button onclick=${ev => emit('add-url')}>add url</button>
        <button onclick=${ev => emit('append-url')}>append url</button>
        <button onclick=${ev => emit('pop-url')}>pop url</button>
        <button onclick=${ev => emit('shift-url')}>shift url</button>
        <button onclick=${ev => emit('re-render')}>plain render</button>
      </div>
      <div id="app">
        <h1>Embed some stuff with Choo</h1>
        ${list.render(state.tweets)}
      </div>
    </div>`
}

var moreTweets = [
  'https://twitter.com/uhhyeahbret/status/898315707254841344',
  'https://www.youtube.com/watch?v=b8HO6hba9ZE',
  'https://twitter.com/uhhyeahbret/status/898214560267608064',
  'https://vimeo.com/229754542',
  'https://twitter.com/uhhyeahbret/status/898196092189253632',
  'https://www.youtube.com/watch?v=bYpKrA233vY'
]

function tweetStore (state, emitter) {
  state.tweets = [
    'https://www.youtube.com/watch?v=wGCoAFZiYMw',
    'https://twitter.com/uhhyeahbret/status/897603426518876161',
    'https://twitter.com/yoshuawuyts/status/895338700531535878'
  ]

  emitter.on('DOMContentLoaded', function () {
    emitter.on('shuffle-urls', function () {
      state.tweets = shuffleArray(state.tweets)
      emitter.emit('render')
    })
    emitter.on('reverse-urls', function () {
      state.tweets = state.tweets.reverse()
      emitter.emit('render')
    })
    emitter.on('add-url', function () {
      var a = moreTweets.pop()
      if (a) {
        state.tweets.unshift(a)
        emitter.emit('render')
      }
    })
    emitter.on('append-url', function () {
      var a = moreTweets.pop()
      if (a) {
        state.tweets.push(a)
        emitter.emit('render')
      }
    })
    emitter.on('pop-url', function () {
      var a = state.tweets.pop()
      if (a) {
        moreTweets.push(a)
        emitter.emit('render')
      }
    })
    emitter.on('shift-url', function () {
      var a = state.tweets.shift()
      console.log(a)
      if (a) {
        moreTweets.push(a)
        emitter.emit('render')
      }
    })
    emitter.on('re-render', function () {
      emitter.emit('render')
    })
  })
}
