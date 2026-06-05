import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import LandingPage from "./pages/landingpage";
import LoginPage from "./pages/loginpage";
import SignupPage from "./pages/signup";
import Dashboard from "./pages/dashboard";

import ProtectedRoute from "./routes/protectedroute";
import PublicRoute from "./routes/publicroute";
import Quiz from "./pages/pagesquiz";
import QuizSelect from "./pages/quizselect";
import UploadNotes from "./pages/document";
import Documents from "./pages/document";
import AIChat from "./pages/aichat";

import Flashcards from "./pages/flashcard";
import FlashcardSelect from "./pages/flashcardselect";
import Resources from "./pages/resources";
import Summary from "./pages/summary"
import Logout from "./components/logout";
;
function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* PUBLIC ROUTES */}

        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        {/* PROTECTED ROUTES */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route 
          path="/quiz-select"
          element={
            <ProtectedRoute>
              <QuizSelect />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/quiz/:documentId"
          element={
            <ProtectedRoute>
              <Quiz/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/flashcard-select"
          element={
            <ProtectedRoute>
              <FlashcardSelect />
            </ProtectedRoute>
          }
        />

        <Route
          path="/flashcards/:documentId"
          element={
            <ProtectedRoute>
              <Flashcards />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Documents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-chat"
          element={
            <ProtectedRoute>
              <AIChat />
            </ProtectedRoute>
          }
        />
        

        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <Resources />
            </ProtectedRoute>
          }
        />
        <Route
  path="/summary/:documentId"
  element={
    <ProtectedRoute>
      <Summary />
    </ProtectedRoute>
  }
/>
<Route
  path="/summary"
  element={
    <ProtectedRoute>
      <Summary />
    </ProtectedRoute>
  }
/>
      <Route
      path="/logout"
      element={
        <ProtectedRoute>
          <Logout />
        </ProtectedRoute>
      }
      />
    </Routes>
      

    </BrowserRouter>
  );
}

export default App;