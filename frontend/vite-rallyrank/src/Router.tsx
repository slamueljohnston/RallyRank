import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/Home.page';

export function Router() {
  const basename = process.env.NODE_ENV === 'production' ? '/RallyRank' : '/';
  
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}