import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';

import { Header } from './components/Header.jsx';
import { Home } from './pages/Home/index.jsx';
import { NotFound } from './pages/_404.jsx';
import './style.css';
import { Admin } from './pages/Admin/index.js';

export function App() {
	return (
		<LocationProvider>
			<main>
				<Router>
					<Route path="/" component={Home} />
					<Route path="/admin/u" component={Admin} />
					<Route default component={NotFound} />
				</Router>
			</main>
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app'));
