import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";

import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import apolloLogger from "apollo-link-logger";
import { ApolloLink } from "apollo-link";
import ApolloClient from "apollo-client";
import { ApolloProvider } from "react-apollo";

import App from "./App";

function token() {
  localStorage.setItem("token", prompt("You github token: ", ""));
  window.location.reload();
}

const httpLink = new HttpLink({
  uri: "https://api.github.com/graphql",
  headers: {
    authorization: "Bearer " + localStorage.getItem("token")
  }
});

const link = ApolloLink.from([apolloLogger, httpLink]);

const cache = new InMemoryCache({
  logger: console.log,
  loggerEnabled: false
});

const client = new ApolloClient({
  link,
  cache
});

ReactDOM.render(
  <ApolloProvider client={client}>
    {localStorage.getItem("token") == null ? (
      <button className="btn btn-primary" onClick={() => token()}>
        Enter Git-Token
      </button>
    ) : (
      <App />
    )}
  </ApolloProvider>,
  document.getElementById("root")
);
