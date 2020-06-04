import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Preloader from "./Preloader";

class AboutRepositories extends React.Component {
  render() {
    const QUERY = gql`
      query {
        repository(name: "${this.props.name}", owner: "${this.props.owner}") {
          createdAt
          updatedAt
          issues {
            totalCount
          }
          languages(first: 10) {
            totalCount
            edges {
              size
              node {
                color
                name
              }
            }
          }
          forkCount
        }
      }
    `;
    return (
      <div>
        <Query query={QUERY}>
          {({ loading, error, data }) => {
            if (loading) return <Preloader />;
            if (error) return console.log(error.message);
            return (
              <div align="center" className="page">
                <button
                  className="close"
                  align="rigth"
                  onClick={() =>
                    this.props.set(this.props.name, this.props.owner, false)
                  }
                >
                  &#10006;
                </button>
                <br />
                <h5>Created: {data.repository.createdAt}</h5>
                <h5>Updated: {data.repository.updatedAt}</h5>
                <h5>Issues count: {data.repository.issues.totalCount}</h5>
                <h5>Forks count: {data.repository.forkCount}</h5>
                <div>
                  <h5>Using languages:</h5>
                  <ul>
                    {data.repository.languages.edges.map((data, key) => {
                      return (
                        <li
                          align="left"
                          key={key}
                          style={{
                            color: data.node.color
                          }}
                        >
                          <div>
                            {data.node.name} : Count strings code: {data.size}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}
export default AboutRepositories;
