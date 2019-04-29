import React from "react";
import "./App.css";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";

const Map = ReactMapboxGl({
  accessToken: process.env.REACT_APP_MAPBOX_TOKEN as string
});

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Map
          style="mapbox://styles/mapbox/dark-v10"
          containerStyle={{
            height: "100vh",
            width: "100vw"
          }}
        >
          <Layer
            type="symbol"
            id="marker"
            layout={{ "icon-image": "marker-15" }}
          >
            <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
          </Layer>
        </Map>
      </header>
    </div>
  );
}

export default App;
