var Tweet = require('twitter-component')
var YoutubeComponent = require('youtube-component')
var Nanocomponent = require('nanocomponent')
var assert = require('assert')
var html = require('bel')
var compare = require('nanocomponent/compare')
var Nanomap = require('../../')
var isArray = Array.isArray

function shapeData (url, i, list) {
  switch (true) {
    case /^https?:\/\/(www\.)?youtu\.be/i.test(url):
    case /^https?:\/\/(www\.)?youtube\.com/i.test(url):
    case /^https?:\/\/(www\.)?vimeo\.com/i.test(url):
    case /^https?:\/\/(www\.)?dailymotion\.com/i.test(url): {
      return {
        id: url,
        arguments: url,
        type: 'youtube-component',
        opts: {
          attr: {
            width: 480,
            height: 270
          }
        }
      }
    }
    case /^https?:\/\/(www\.)?twitter.com\/.*\/status\/\d*$/i.test(url): {
      return {
        id: url,
        arguments: url,
        type: 'twitter-component'
      }
    }
  }
}

class MixedList extends Nanocomponent {
  constructor () {
    super()

    this.urls = null
    this.mapper = new Nanomap({
      'youtube-component': YoutubeComponent,
      'twitter-component': Tweet
    })
  }

  createElement (urls) {
    assert(isArray(urls), 'MixedList: urls must be an array of tweet URLs')
    this.urls = urls.slice() // Have to slice since urls is an array
    return html`
      <div>
        ${urls.map(shapeData).map(this.mapper)}
      </div>
    `
  }
  update (urls) {
    assert(isArray(urls), 'tweetList must be an array of tweet URLs')
    return compare(this.urls, urls)
  }
}

module.exports = MixedList
