import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Preloader from "./Preloader";

const QUERY = gql`
  query {
    viewer {
      id
      login
      repositories(first: 10) {
        nodes {
          name
          url
          owner {
            login
            avatarUrl
          }
        }
      }
    }
  }
`;

class UserRepositories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: "",
      name: "",
      isPage: false
    };
  }
  render() {
    return (
      <Query query={QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <Preloader />;
          if (error)
            return (
              <p>
                Invalid token{" "}
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    localStorage.setItem("token", prompt("Enter to token", ""));
                    window.location.reload();
                  }}
                >
                  Enter
                </button>
              </p>
            );
          const reps = data.viewer.repositories.nodes;
          if (!this.state.isPage) {
            return (
              <div align="center">
                <h4>{data.viewer.login}</h4>
                {reps.map((data, key) => {
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
                          <p className="p-2">{data.name}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }
        }}
      </Query>
    );
  }
}

export default UserRepositories;
