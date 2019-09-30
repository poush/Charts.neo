import React, { Component } from "react";

import neo4jDesktop from "./neo4jdesktop";
import ShimConnectModal from "./ShimConnectModal";

class Neo4jDesktopStandIn extends Component {
  state = {
    username: null,
    password: null,
    host: null,
    port: null,
    encrypted: null
  };

  stateComplete() {
    return (
      this.state.username &&
      this.state.password &&
      this.state.host &&
      this.state.port
    );
  }

  onSubmit = ({ username, password, host, port, encrypted }) => {
    window.neo4jDesktopApi = {
      getContext: () =>
        Promise.resolve(
          neo4jDesktop.buildFakeContext({
            host: host.trim(),
            port,
            username,
            password,
            encrypted,
            name: this.props.name || "shim"
          })
        )
    };

    this.setState({ username, password, host, port, encrypted });
  };

  render() {
    if (this.stateComplete()) {
      return this.props.children;
    }

    return (
      <ShimConnectModal
        key="modal"
        errorMsg=""
        onSubmit={this.onSubmit}
        show={true}
      />
    );
  }
}

export default Neo4jDesktopStandIn;
