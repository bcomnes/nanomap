var test = require('tape')
var YoutubeComponent = require('youtube-component')
var TwitterComponent = require('twitter-component')
var Nanomap = require('./')

function makeID () {
  return 'testid-' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
}

function createTestElement () {
  var testRoot = document.createElement('div')
  testRoot.id = makeID()
  document.body.appendChild(testRoot)
  return testRoot
}

function renderAndMount (testEl, data, mapper) {
  var els = data.map(mapper)
  els.forEach(function (el) {
    testEl.appendChild(el)
  })
}

test('simple mapper', function (t) {
  var testRoot = createTestElement()
  var simpleMapper = new Nanomap(YoutubeComponent)
  var videos = [
    'https://www.youtube.com/watch?v=b8HO6hba9ZE',
    'https://vimeo.com/229754542',
    'https://www.youtube.com/watch?v=bYpKrA233vY'
  ].map(function (url) {
    return { id: url, arguments: url }
  })

  t.doesNotThrow(renderAndMount.bind(null, testRoot, videos, simpleMapper), 'Able to render list of videos')
  t.true(testRoot.children[0].children[0].src.includes('youtube.com/embed/b8HO6hba9ZE'), 'videos are in page')
  t.end()
})

test('mixed mapper', function (t) {
  var testRoot = createTestElement()
  var mixedMapper = new Nanomap({
    video: YoutubeComponent,
    tweet: TwitterComponent,
    default: TwitterComponent
  })
  var videos = [
    'https://www.youtube.com/watch?v=b8HO6hba9ZE',
    'https://vimeo.com/229754542',
    'https://www.youtube.com/watch?v=bYpKrA233vY'
  ].map(function (url) {
    return { id: url, arguments: url, type: 'video' }
  })

  var tweets = [
    'https://twitter.com/uhhyeahbret/status/897603426518876161',
    'https://twitter.com/yoshuawuyts/status/895338700531535878'
  ].map(function (url) {
    return { id: url, arguments: url, type: 'tweet' }
  })

  delete tweets[0].type

  var data = videos.concat(tweets)

  t.doesNotThrow(renderAndMount.bind(null, testRoot, data, mixedMapper), 'Able to render list of videos')
  t.true(testRoot.children[0].children[0].src.includes('youtube.com/embed/b8HO6hba9ZE'), 'videos are in page')
  t.end()
})
