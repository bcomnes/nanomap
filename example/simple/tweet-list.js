var Tweet = require('twitter-component')
var Nanocomponent = require('nanocomponent')
var assert = require('assert')
var html = require('bel')
var compare = require('nanocomponent/compare')
var Nanomap = require('../../')
var isArray = Array.isArray

function shapeTweetList (tweetUrl, i, list) {
  return {
    id: tweetUrl,
    opts: {
      placeholder: false
    },
    arguments: tweetUrl
  }
}

class TweetList extends Nanocomponent {
  constructor () {
    super()

    this.tweetList = null
    this.mapper = new Nanomap({ gc: false }, Tweet)
  }

  createElement (tweetList) {
    assert(isArray(tweetList), 'tweetList must be an array of tweet URLs')
    this.tweetList = tweetList.slice() // Have to slice since tweetList is an array
    return html`
      <div>
        ${tweetList.map(shapeTweetList).map(this.mapper)}
      </div>
    `
  }
  update (tweetList) {
    assert(isArray(tweetList), 'tweetList must be an array of tweet URLs')
    return compare(this.tweetList, tweetList)
  }
}

module.exports = TweetList
