import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { React, createContext, useEffect, useState } from "react";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "pages/landingPage/Home";
import About from "pages/landingPage/AboutUs/About";
import PrivacyPolicy from "pages/landingPage/AboutUs/PrivacyPolicy";
import CookiePolicy from "pages/landingPage/AboutUs/CookiePolicy";
import Companies from "pages/landingPage/Companies";
import InfoRecruiter from "pages/landingPage/InfoRecruiter";
import Jobs from "pages/landingPage/Jobs";
import Job from "pages/landingPage/Job";
import Refer from "pages/landingPage/Refer";
import ForRecruiter from "pages/landingPage/For/ForRecruiter";
import ForApplicant from "pages/landingPage/For/ForApplicant";
import SignIn from "pages/landingPage/SignIn/SignIn";
import SignUp from "pages/landingPage/SignUp/SignUp";
import ResetPassword from "pages/landingPage/SignIn/ResetPassword";
import { Reset } from "pages/landingPage/SignIn/Reset";
import Recovered from "pages/landingPage/SignIn/EmailVerify/Recovered";
import Logout from "pages/landingPage/Logout";

import Leaderboard from "pages/home/Leaderboard";
import Referrals from "pages/home/Referrals";
import Settings from "pages/home/Settings";

import AdminJobs from "pages/admin/AdminJobs";
import AdminJob from "pages/admin/AdminJob";
import AdminAddJob from "pages/admin/AdminAddJob";
import AdminSettings from "pages/admin/AdminSettings";
import TalentPool from "pages/admin/TalentPool";
import { Dashboard } from "pages/Admin1/Dashboard";

import BlogHome from "components/blog/home-blog";
import DetailNews from "components/blog/body-news/DetailNews";

import Navbar from "components/Navbar";
import InfoBar from "components/InfoBar";
import Footer from "components/Footer";
import ScrollToTop from "hooks/ScrollToTop";

import { userType } from "libs/isAuth";

export const SetPopupContext = createContext();

export default function App() {
  // ✅ FIX: null safe
  const type = userType() || "";
  // console.log("type:", type); // debug ke baad hata sakte ho

  const [popup, setPopup] = useState({
    open: false,
    icon: "",
    message: "",
  });

  useEffect(() => {
    if (popup.open && popup.icon && popup.message) {
      toast[popup.icon](popup.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: Slide,
      });

      setPopup((prev) => ({ ...prev, open: false }));
    }
  }, [popup]);

  return (
    <SetPopupContext.Provider value={setPopup}>
      <Router>
        <ScrollToTop />
        <InfoBar />
        <Navbar />

        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<InfoRecruiter />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-in/forgot-password" element={<ResetPassword />} />
          <Route path="/password/reset/:token" element={<Reset />} />
          <Route path="/reset-recovered" element={<Recovered />} />

          {/* Applicant */}
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<Job />} />
          <Route path="/jobs/:id/refer" element={<Refer />} />
          <Route path="/for-applicant" element={<ForApplicant />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/applicant/settings" element={<Settings />} />

          {/* Recruiter / Admin */}
          <Route path="/for-recruiter" element={<ForRecruiter />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/admin" element={<AdminJobs />} />
          <Route path="/admin/:id" element={<AdminJob />} />
          <Route path="/create-new-job" element={<AdminAddJob />} />
          <Route path="/talent-pool" element={<TalentPool />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          {/* Auth */}
          <Route path="/logout" element={<Logout />} />

          {/* Blog */}
          <Route path="/blog/*" element={<BlogHome />} />
          <Route path="/blog/news/:id" element={<DetailNews />} />
        </Routes>

        <Footer />
      </Router>

      <ToastContainer limit={2} autoClose={2000} />
    </SetPopupContext.Provider>
  );
}
