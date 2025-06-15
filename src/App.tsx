import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Layout from "@/components/Layout";
import Home from "./pages/Home";
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import Lessons from "@/pages/lessons/Lessons";
import Profile from "@/pages/Profile";
import { Toaster } from "@/components/ui/sonner";
import CreateLesson from "@/pages/lessons/CreateLesson";
import EditLesson from "@/pages/lessons/EditLesson";
import Dashboard from "@/pages/Dashboard";
import LessonDetails from "@/pages/lessons/LessonDetails";
import AdminDashboard from "@/pages/AdminDashboard";
import PaymentSuccess from "@/pages/payment/PaymentSuccess";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen">
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/signup" element={<SignUp />} />
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Lessons = was events */}
                <Route path="/lessons" element={<Lessons />} />
                <Route path="/lessons/create" element={<CreateLesson />} />
                <Route path="/lessons/edit/:lessonId" element={<EditLesson />} />
                <Route path="/lessons/:id" element={<LessonDetails />} />

                <Route path="/profile" element={<Profile />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
            <Toaster />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;