# nanomap

[![Greenkeeper badge](https://badges.greenkeeper.io/bcomnes/nanomap.svg)](https://greenkeeper.io/)

Functinally map data to stateful [nanocomponents][nc].

## API
### `mapper = new Mapper([opts], Component)`
### `mapper = Mapper([opts], { type: Component, [default: Component]})`

```js
var Nanomap = require('nanocomponent/map')
var simpleMapper = new Nanomap(opts, Component)
// OR
var complexMapper = new Nanomap(opts, {
  type1: Component1,
  type2: Component2,
  ...,
  default: DefaultComponent
})

[{
  id: 'foo123',
  opts: { color: 'blue' },
  arguments: {some: 'args'}
}].map(simpleMapper.render) // Array of rendered DOM nodes from homogeneous components

[{
  id: 'foo123',
  type: 'type1',
  opts: { color: 'blue' },
  arguments: ['hey', 'green', 6] // component.render.apply(component, arguments)
}].map(complexMapper.render) // Array of rendered DOM nodes from a heterogeneous set of components
```

See [nanomap]() for full API details.

