import React from "react";
import AboutRepositories from "./AboutRepositories";
import UserRepositories from "./UserRepositories";
import PublicRepositories from "./PublicRepositories";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      SelectUser: true,
      owner: "",
      name: "",
      per_page: 10,
      sort: "stars",
      isPage: false
    };
  }

  setIsPage(owner, name, isPage) {
    this.setState(() => ({
      owner: owner,
      name: name,
      isPage: isPage
    }));
  }

  render() {
    return (
      <div className="">
        <h6 className="text-center">
          Token: cd0d48a438728e22b5b7e7327287eefc59f25a2c
        </h6>
        <br />
        <div className="nav nav-pills nav-fill">
          <button
            className="nav-item border btn btn-info"
            onClick={() => {
              this.setState(() => ({ SelectUser: false }));
            }}
          >
            Public repositories
          </button>
          <button
            className="nav-item border btn btn-success"
            onClick={() => {
              this.setState(() => ({ SelectUser: true }));
            }}
          >
            My repositories
          </button>
          <button
            className="nav-item border btn btn-danger"
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            Log out
          </button>
        </div>
        {this.state.SelectUser ? (
          <UserRepositories set={(o, n, i) => this.setIsPage(o, n, i)} />
        ) : (
          <PublicRepositories set={(o, n, i) => this.setIsPage(o, n, i)} />
        )}
        {this.state.isPage && (
          <AboutRepositories
            name={this.state.name}
            owner={this.state.owner}
            set={(o, n, i) => this.setIsPage(o, n, i)}
          />
        )}
      </div>
    );
  }
}

export default App;
