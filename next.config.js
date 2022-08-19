const withTM = require('next-transpile-modules')([
  'react-dnd',
  'react-dnd-html5-backend',
  'dnd-core',
  '@react-dnd/invariant',
  '@react-dnd/asap',
  '@react-dnd/shallowequal',
])

module.exports = withTM({
  images: {
    domains: ['res.cloudinary.com'],
  },
})
