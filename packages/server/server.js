const { ApolloServer, gql, PubSub } = require('apollo-server')

const pubsub = new PubSub()

// The GraphQL schema
const typeDefs = gql`
  type Query {
    "A simple type for getting started!"
    hello: String
  }

  type Subscription {
    time: String
  }
`

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: () => 'world',
  },

  Subscription: {
    time: {
      subscribe: () => pubsub.asyncIterator('TIME'),
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    path: '/',
  },
})

setInterval(() => {
  pubsub.publish('TIME', { time: Date.now().toString() })
}, 500)

server.listen(process.env.PORT || 9000).then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`)
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
})
