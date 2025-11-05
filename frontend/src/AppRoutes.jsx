import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import ReadingInterface from './pages/ReadingInterface';
import Library from './pages/Library';
import ProgressSync from './pages/ProgressSync';
import BookSummary from './pages/BookSummary';

function AppRoutes() {
  return (
    <div className="min-h-screen w-screen bg-background text-text">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/read" element={<ReadingInterface />} />
        <Route path="/library" element={<Library />} />
        <Route path="/progress" element={<ProgressSync />} />
        <Route path="/book/:id" element={<BookSummary />} />
      </Routes>
    </div>
  );
}

export default AppRoutes;
