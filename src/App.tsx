import React from "react";
import "./App.css";
import ReactMapboxGl, { Layer, Feature, Popup } from "react-mapbox-gl";
import axios from "axios";

interface IWikipediaResponse {
  lat: number;
  lon: number;
  pageid: number;
  title: number;
}

interface IWikiItem {
  latitude: number;
  longitude: number;
  pageId: number;
  title: string;
}

interface IAppState {
  latitude: number;
  longitude: number;
  selectedItemIndex: number;
  showErrorDialog: boolean;
  items: IWikiItem[];
}

const Map = ReactMapboxGl({
  accessToken: process.env.REACT_APP_MAPBOX_TOKEN as string
});

class App extends React.Component<{}, IAppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      latitude: 47.6072062,
      longitude: -122.3350407,
      showErrorDialog: false,
      selectedItemIndex: -1,
      items: []
    };
  }

  componentDidMount(): void {
    navigator.geolocation.getCurrentPosition(
      (pos: Position) => {
        this.setState({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });

        this.getArticles();
      },
      () => {
        // TODO render error if location permission not granted
        this.setState({ showErrorDialog: true });
      }
    );
  }

  componentDidUpdate(_prevProps: {}, prevState: IAppState): void {
    if (
      prevState.latitude !== this.state.latitude ||
      prevState.longitude !== this.state.longitude
    ) {
      this.getArticles();
      // TODO debounce/ add min change threshold
    }
  }

  render(): JSX.Element {
    return (
      <div className="App">
        <header className="App-header">{"NEARME"}</header>
        <div className="mapContainer">
          <div className="mapInner">
            <Map
              style="mapbox://styles/mapbox/dark-v10"
              containerStyle={{
                height: "100%",
                width: "100%"
              }}
              center={[this.state.longitude, this.state.latitude]}
              onMoveEnd={map => {
                console.log("MOVED");
                // TODO there is clearly a bug here, find a better way to keep this in sync
                if (!isNaN(map.transform._center.lat)) {
                  this.setState({
                    latitude: map.transform._center.lat,
                    longitude: map.transform._center.lng
                  });
                }
              }}
            >
              {this.renderPopUp()}
              <Layer
                type="symbol"
                id="marker"
                layout={{
                  "icon-image": "marker-15",
                  "icon-size": 2
                  //   "icon-color": "#f2e353"
                }}
              >
                {this.state.items.map((item, index) => (
                  <Feature
                    coordinates={[item.longitude, item.latitude]}
                    onClick={() => this.setState({ selectedItemIndex: index })}
                  />
                ))}
              </Layer>
            </Map>
          </div>
        </div>
      </div>
    );
  }

  renderPopUp(): JSX.Element | undefined {
    if (this.state.selectedItemIndex >= 0) {
      const item = this.state.items[this.state.selectedItemIndex];
      return (
        <Popup
          coordinates={[item.longitude, item.latitude]}
          offset={{
            "bottom-left": [12, -38],
            "bottom-right": [-12, -38]
          }}
        >
          <h1>{item.title}</h1>
        </Popup>
      );
    }
    return undefined;
  }

  getArticles(): void {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=${
      this.state.latitude
    }|${this.state.longitude}&format=json&origin=*`;

    axios.get(url).then(res => {
      const wikiItems: IWikiItem[] = res.data.query.geosearch.map(
        (responseItem: IWikipediaResponse) => {
          return {
            latitude: responseItem.lat,
            longitude: responseItem.lon,
            pageId: responseItem.pageid,
            title: responseItem.title
          };
        }
      );

      this.setState({ items: wikiItems });
    });
  }
}

export default App;
