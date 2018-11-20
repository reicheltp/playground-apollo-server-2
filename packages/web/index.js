import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient } from 'apollo-boost'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws'
import { ApolloProvider, Query, Subscription } from 'react-apollo'
import gql from 'graphql-tag'

import { split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { getMainDefinition } from 'apollo-utilities'

// Create an http link:
const httpLink = new HttpLink({
  uri: 'http://localhost:9000',
})

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `ws://localhost:9000`,
  options: {
    reconnect: true,
  },
})

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink,
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

const HELLO_QUERY = gql`
  query {
    hello
  }
`

const TIME_SUBSCRIPTION = gql`
  subscription {
    time
  }
`

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <h3>QUERY</h3>
      <Query query={HELLO_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <p>Loading...</p>
          if (error) return <p>Error :(</p>

          return <div>{JSON.stringify(data)}</div>
        }}
      </Query>

      <h3>SUBSCRIPTION</h3>
      <Subscription subscription={TIME_SUBSCRIPTION}>
        {({ data, loading, error }) => {
          if (loading) return <p>Loading...</p>
          if (error) return <p>Error :(</p>

          return <div>{JSON.stringify(data)}</div>
        }}
      </Subscription>
    </div>
  </ApolloProvider>
)

ReactDOM.render(<App />, document.getElementById('root'))

// Hot Module Replacement
if (module.hot) {
  module.hot.accept()
}
