var assert = require('assert')
var isArray = Array.isArray

function Nanomap (opts, Callback) {
  if (!(this instanceof Nanomap)) return new Nanomap()
  assert(arguments.length > 0 && arguments.length <= 2, 'Provide the correct number of arguments')
  if (arguments.length < 2) {
    Callback = opts
    opts = {}
  }

  opts = Object.assign({}, opts)

  if (typeof Callback === 'function') {
    Callback = {
      default: Callback
    }
  }

  this.mapping = false

  this.lastCache = null // Instance cache
  this.nextCache = {}
  this.lastTypeCache = null // Type instance cache
  this.nextTypeCache = {}
}

Nanomap.prototype.render = function (c, i, array) {
  if (i === 0) {
    // Setup a a fresh cache
    if (this.mapping !== false) console.warn('Nanomap: new map started with unfinished map span') // TODO Remove this if it never happens
    this.mapping = true
    this.lastCache = this.nextCache
    this.lastTypeCache = this.nextTypeCache
    this.nextCache = {}
    this.nextTypeCache = {}
  }
  var instance
  var Callback = this.Callback
  var args = isArray(c.arguments) ? c.arguments : [c.arguments]
  if (this.lastCache[c.id] && this.lastTypeCache[c.id] === (c.type || 'default')) {
    instance = this.nextCache[c.id] = this.lastCache[c.id]
    this.nextTypeCache[c.id] = (c.type || 'default')
  } else {
    instance = this.nextCache[c.id] = new Callback[c.type || 'default'](c.opts)
    this.nextTypeCache[c.id] = c.type || 'default'
  }

  if (i === (array.length - 1)) {
    // Clean up old cache references
    this.lastCache = null
    this.lastTypeCache = null
    this.mapping = false
  }

  return instance.render.apply(instance, args)
}

module.exports = Nanomap
