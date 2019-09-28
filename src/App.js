import "react-chart-editor/lib/react-chart-editor.css";

import { CONNECTED, GraphAppBase } from "graph-app-kit/components/GraphAppBase";
import plotly from "plotly.js/dist/plotly";
import React, { Component } from "react";
import PlotlyEditor from "react-chart-editor";
import { Button, Input, InputGroup, InputGroupAddon, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import Neo4jDesktopStandIn from "./neodesktop";

const config = { editable: true };

const neo4j = require("neo4j-driver/lib/browser/neo4j-web.min.js").v1;

class ConnectedApp extends Component {
  constructor() {
    super();
    this.state = {
      cTag: 1,
      data: [],
      layout: {},
      frames: [],
      modal: false,
      currentMockIndex: -1,
      mocks: [],
      dataSource: {
        x: [2001, 2002, 2003],
        y: [2, 1, 4],
        z: [2, 3, 7]
      },
      datalist: [
        {
          n: "",
          v: ""
        }
      ],
      dataSourceOptions: [
        {
          value: "x",
          label: "x"
        },
        {
          value: "y",
          label: "y"
        },
        {
          value: "z",
          label: "z"
        }
      ]
    };
    this.toggle = this.toggle.bind(this);
  }
  createDataSource(data) {
    let obj = {};
    data.forEach((ob, i) => {
      obj[ob['n']] = this.cypherQuery(ob['v'])
    });
    return obj;
  }

  cypherQuery(query) {
    // wip: get the data from neo4j cypher query
    return query;
  }

  createDataSourceOptions(data) {
    let obj = [];
    data.forEach((v, i) => {
      obj.push({ value: v["n"], label: v["n"] });
    });
    return obj;
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  saveVars = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
      dataSource: this.createDataSource(prevState.datalist),
      dataSourceOptions: this.createDataSourceOptions(prevState.datalist)
    }), 
    () => {
      // update data options in callback
      this.updateDataOptions()
    })

  }

  addVars = (datalist) => {
    this.setState(state => ({
      datalist: datalist
    }));
    console.log(this.state.datalist);
  }

  addNewVar = () => {
    this.setState( prevState => {
      return {
        datalist: [...prevState.datalist, {n: "", v: ""}]
      }
    })
  }

  reRunManually = () => {
    this.setState(state => ({ cTag: state.cTag + 1 }));
  };

  updateDataOptions = () => {
    console.log(this.state.dataSource);
    this.setState({
      dataSourceOptions: Object.keys(this.state.dataSource).map( name => ({
        value: name,
        label: name
      })
    )})
  };

  handleChange = (event, index) => {
    console.log('handle change called')

    // dont remove this, this is what keeps this thing working
    event.persist()

    if(['name', 'query'].includes(event.target.classList[0])) {
      this.setState((prevState) => {
        let newDatalist = [...prevState.datalist]
        if(event.target.classList[0] === 'query') {
          newDatalist[index]['v'] = event.target.value
        }
        else {
          newDatalist[index]['n'] = event.target.value
        }
        return {
          datalist: newDatalist
        }
      })
    }
  }

  render() {
    let { datalist } = this.state
    return (
      <div className="app">
        <PlotlyEditor
          data={this.state.data}
          layout={this.state.layout}
          config={config}
          frames={this.state.frames}
          dataSources={this.state.dataSource}
          dataSourceOptions={this.state.dataSourceOptions}
          plotly={plotly}
          onUpdate={(data, layout, frames) =>
            this.setState({ data, layout, frames })
          }
          useResizeHandler
          debug
          advancedTraceTypeSelector
        />
        <Button color="danger" onClick={this.toggle}>
          Set Variables
        </Button>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>Set Variables</ModalHeader>
          <ModalBody>
            {datalist.map((obj, i) => {
              return (
                <InputGroup key={i}>
                  <InputGroupAddon addonType="prepend">
                    <Input
                      data-id={i}
                      className="name"
                      placeholder="variable name"
                      defaultValue={obj.n}
                      onChange={(e) => this.handleChange(e, i)}
                    />
                  </InputGroupAddon>
                  <Input
                    data-id={i}
                    className="query"
                    defaultValue={obj.v}
                    onChange={(e) => this.handleChange(e, i)}
                    placeholder="query" />
                </InputGroup>
              );
            })}
            <br />
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={this.addNewVar}
            >
              Add Variable
            </Button>{" "}
            <Button color="secondary" onClick={this.saveVars}>
              Save
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const App = () => {
  // sentry.init();

  // If this global is defined, we're running in desktop.  If it isn't, then we need
  // to use the shim object to convince the rest of the app we're in Desktop.
  const fakeDesktopApiNeeded = window.neo4jDesktopApi ? true : false;

  if (fakeDesktopApiNeeded) {
    return (
      <Neo4jDesktopStandIn
        username="neo4j"
        password="admin"
        host="localhost"
        port="7687"
        name="shim"
      >
        <ConnectedApp key="app" connected={true} />
      </Neo4jDesktopStandIn>
    );
  } else {
    return (
      <GraphAppBase
        driverFactory={neo4j}
        integrationPoint={window.neo4jDesktopApi}
        render={({
          connectionState /*, connectionDetails, setCredentials */
        }) => {
          return (
            <ConnectedApp key="app" connected={connectionState === CONNECTED} />
          );
        }}
      />
    );
  }
};

export default App;
