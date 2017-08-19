var assert = require('assert')
var isArray = Array.isArray

function Nanomap (opts, Callback) {
  if (!(this instanceof Nanomap)) return new Nanomap(opts, Callback)
  assert(arguments.length > 0 && arguments.length <= 2, 'Provide the correct number of arguments')
  if (arguments.length < 2) {
    Callback = opts
    opts = {}
  }

  opts = Object.assign({
    gc: true
  }, opts)

  this.gc = opts.gc

  if (typeof Callback === 'function') {
    Callback = {
      default: Callback
    }
  }

  this.Callback = Callback

  this.mapping = false

  this.lastCache = {} // Instance cache
  this.nextCache = {}
  this.lastTypeCache = {} // Type instance cache
  this.nextTypeCache = {}

  return this.render.bind(this)
}

Nanomap.prototype.render = function (c, i, array) {
  assert(c.hasOwnProperty('id'),
    'Nanomap: all map objects must have an \'id\' property')
  if (c.hasOwnProperty('type')) {
    assert(this.Callback.hasOwnProperty(c.type),
    `Nanomap: type ${c.type} not defined for this mapper`)
  } else {
    assert(this.Callback.hasOwnProperty('default'),
    `Nanomap: mappers processing map objects without a 'type' property must implement a 'default' Component`)
  }
  if (i === 0) {
    // Setup a a fresh cache
    this.mapping = true
    this.lastCache = this.nextCache
    this.lastTypeCache = this.nextTypeCache
    if (this.gc) {
      this.nextCache = {}
      this.nextTypeCache = {}
    }
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
    if (this.gc) {
      this.lastCache = null
      this.lastTypeCache = null
    }
    this.mapping = false
  }

  return instance.render.apply(instance, args)
}

module.exports = Nanomap
