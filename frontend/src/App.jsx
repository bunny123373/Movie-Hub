import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { WatchlistProvider } from './contexts/WatchlistContext'
import { NotificationProvider } from './context/NotificationContext'
import { NotificationEventProvider } from './context/NotificationEventContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import SeriesDetails from './pages/SeriesDetails'
import SearchResults from './pages/SearchResults'
import Watchlist from './pages/Watchlist'
import NotFound from './pages/NotFound'
import AdminDashboard from './pages/AdminDashboard'
import AdminMovieForm from './pages/AdminMovieForm'
import RealTimeNotifications from './components/RealTimeNotifications'
import ReportIssue from './pages/ReportIssue'
import FAQ from './pages/FAQ'
import Support from './pages/Support'
import HowToDownload from './pages/HowToDownload'
import RequestMovie from './pages/RequestMovie'

function App() {
  return (
    <WatchlistProvider>
      <NotificationProvider>
        <NotificationEventProvider>
          <RealTimeNotifications />
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Routes>
          {/* Admin Routes - No Navbar/Footer */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          
          {/* Public Routes - With Navbar/Footer */}
          <Route path="/*" element={<PublicRoutes />} />
        </Routes>
      </div>
      </NotificationEventProvider>
      </NotificationProvider>
    </WatchlistProvider>
  )
}

function PublicRoutes() {
  return (
    <>
      <Navbar />
      <main className="pt-16 flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/series/:id" element={<SeriesDetails />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/support" element={<Support />} />
          <Route path="/support/how-to-download" element={<HowToDownload />} />
          <Route path="/support/report-issue" element={<ReportIssue />} />
          <Route path="/support/request-movie" element={<RequestMovie />} />
          <Route path="/support/faq" element={<FAQ />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/add" element={<AdminMovieForm />} />
      <Route path="/edit/:id" element={<AdminMovieForm />} />
    </Routes>
  )
}

export default App
