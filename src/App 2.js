class App extends Component {
  render() {
    return (
      <div className="app">
        <PlotlyEditor
          data={this.state.data}
          layout={this.state.layout}
          config={config}
          frames={this.state.frames}
          dataSources={dataSources}
          dataSourceOptions={dataSourceOptions}
          plotly={plotly}
          onUpdate={(data, layout, frames) =>
            this.setState({ data, layout, frames })
          }
          useResizeHandler
          debug
          advancedTraceTypeSelector
        />
      </div>
    );
  }
}

export default App;
