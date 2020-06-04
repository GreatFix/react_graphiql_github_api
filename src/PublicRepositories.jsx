import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Preloader from "./Preloader";

class PublicRepositories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDefault: true,
      searchText: "*",
      cursor: "$afterCursor",
      queryValue: "Search($afterCursor: String)",
      page: "after: "
    };
  }
  searchButton() {
    this.setState(() => {
      return {
        isDefault: false,
        searchText: document.getElementById("search-text").value
      };
    });
  }

  nextPage(cursor) {
    let temp = cursor.toString();
    this.setState(() => {
      return {
        cursor: '"' + temp + '"',
        queryValue: "Search",
        page: "after: "
      };
    });
  }

  prevPage(cursor) {
    let temp = cursor.toString();
    this.setState(() => {
      return {
        cursor: '"' + temp + '"',
        queryValue: "Search",
        page: "before: "
      };
    });
  }

  render() {
    const DEFAULT_QUERY = gql`
    query ${this.state.queryValue}{
      search(query: "is:public", type: REPOSITORY, ${this.state.page +
        this.state.cursor}, first: 10) {
    repositoryCount
    pageInfo {
      endCursor
      startCursor
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ... on Repository {
        id
        name
        owner {
          login
          avatarUrl
          url
        }
      }
    }
  }
}
  `;
    let queryText = this.state.searchText;
    const SEARCH_QUERY = gql`
    query ${this.state.queryValue}{
      search(query: "${queryText}", type: REPOSITORY, ${this.state.page +
      this.state.cursor}, first: 10) {
      repositoryCount
      pageInfo {
        endCursor
        startCursor
        hasNextPage
        hasPreviousPage
      }
      nodes {
        ... on Repository {
        id
        name
        owner {
          login
          avatarUrl
          url
        }
      }
    }
  }
}
  `;
    return (
      <Query query={this.state.isDefault ? DEFAULT_QUERY : SEARCH_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <Preloader />;
          if (error) return console.log(error.massage);
          const reps = data.search;
          if (!this.state.isPage) {
            return (
              <div className="mr-3 ml-3">
                <div className="row">
                  <input className="form-control col" id="search-text" />
                  <button
                    className="btn btn-success col-3 ml-1"
                    onClick={() => this.searchButton()}
                  >
                    Search{" "}
                    <span role="img" aria-label="search-img">
                      &#128270;
                    </span>
                  </button>
                </div>
                <br />
                {reps.nodes.map((data, key) => {
                  return (
                    <div
                      className="border row"
                      key={key}
                      onClick={() =>
                        this.props.set(data.owner.login, data.name, true)
                      }
                    >
                      <img
                        className="ava"
                        src={data.owner.avatarUrl}
                        alt="img"
                      />
                      <div>
                        <div>
                          <p className="p-2">{data.owner.login}</p>
                        </div>
                        <div>
                          <a className="p-2" href={data.url}>
                            {data.name}
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {reps.pageInfo.hasPreviousPage && (
                  <button
                    onClick={() => this.prevPage(reps.pageInfo.startCursor)}
                  >
                    &lArr;
                  </button>
                )}
                <button onClick={() => this.nextPage(reps.pageInfo.endCursor)}>
                  &rArr;
                </button>
                {data.search.repositoryCount} results
              </div>
            );
          }
        }}
      </Query>
    );
  }
}

export default PublicRepositories;
