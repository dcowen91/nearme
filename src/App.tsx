import React from 'react';
import './App.css';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';

interface IAppState {
	latitude: number;
	longitude: number;
	showErrorDialog: boolean;
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
			showErrorDialog: false
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

	render(): JSX.Element {
		return (
			<div className="App">
				<header className="App-header">{'NEARME'}</header>
				<div className="mapContainer">
					<div className="mapInner">
						<Map
							style="mapbox://styles/mapbox/dark-v10"
							containerStyle={{
								height: '100%',
								width: '100%'
							}}
							center={[this.state.longitude, this.state.latitude]}
						>
							<Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
								<Feature coordinates={[this.state.longitude, this.state.latitude]} />
							</Layer>
						</Map>
					</div>
				</div>
			</div>
		);
	}

	getArticles(): void {
		// TODO server/ request handling
		// 'https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=37.786971|-122.399677&format=json',
	}
}

export default App;
