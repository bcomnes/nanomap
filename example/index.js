var Nanomap = require('./')
var Nanocomponent = require('nanocomponent')

var html = require('choo/html')
var choo = require('choo')

var app = choo()
app.use(titleStore)
app.route('/', mainView)
document.body.appendChild(app.start())

function mainView (state, emit) {
  return html`
    <div id="app">
      <h1>Title: ${state.title}</h1>
      <input type="text" value="${state.title}" oninput=${update} />
    </div>
  `

  function update (e) {
    emit('update', e.target.value)
  }
}

function titleStore (state, emitter) {
  state.title = 'Not quite set yet'
  emitter.on('DOMContentLoaded', function () {
    emitter.on('update', function (newTitle) {
      state.title = newTitle
      emitter.emit('render')
    })
  })
}
