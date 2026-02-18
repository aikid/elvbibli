import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import HomePage from './pages/HomePage';
import BookDetailPage from './pages/BookDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/livro/:id" element={<BookDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
