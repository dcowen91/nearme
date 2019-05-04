import React from 'react';
import './App.css';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import axios from 'axios';

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
								{this.state.items.map(item => (
									<Feature coordinates={[item.longitude, item.latitude]} />
								))}
								{/* <Feature coordinates={[this.state.longitude, this.state.latitude]} /> */}
							</Layer>
						</Map>
					</div>
				</div>
			</div>
		);
	}

	getArticles(): void {
		const url = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=${
			this.state.latitude
		}|${this.state.longitude}&format=json&origin=*`;

		axios.get(url).then(res => {
			const wikiItems: IWikiItem[] = res.data.query.geosearch.map((responseItem: IWikipediaResponse) => {
				return {
					latitude: responseItem.lat,
					longitude: responseItem.lon,
					pageId: responseItem.pageid,
					title: responseItem.title
				};
			});

			this.setState({ items: wikiItems });
		});
	}
}

export default App;
