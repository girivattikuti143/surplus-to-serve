import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { DatabaseSetupModal } from './components/DatabaseSetupModal';
import { DeliveryTrackingMap } from './components/DeliveryTrackingMap';

// Pages
import { HomePage } from './pages/HomePage';
import { DonationsPage } from './pages/DonationsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DonorDashboard } from './pages/DonorDashboard';
import { NgoDashboard } from './pages/NgoDashboard';
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

function AppContent() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isDbModalOpen, setIsDbModalOpen] = useState<boolean>(false);
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash) {
        setCurrentPage(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.location.hash = `#/${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigateTo} onOpenDbModal={() => setIsDbModalOpen(true)} />;
      case 'donations':
        return <DonationsPage onNavigate={navigateTo} />;
      case 'how-it-works':
        return <HowItWorksPage onNavigate={navigateTo} />;
      case 'about':
        return <AboutPage onNavigate={navigateTo} />;
      case 'contact':
        return <ContactPage />;
      case 'login':
        return <LoginPage onNavigate={navigateTo} />;
      case 'register':
        return <RegisterPage onNavigate={navigateTo} />;
      case 'donor-dashboard':
        return <DonorDashboard onNavigate={navigateTo} />;
      case 'ngo-dashboard':
        return <NgoDashboard onNavigate={navigateTo} />;
      case 'volunteer-dashboard':
        return <VolunteerDashboard onNavigate={navigateTo} />;
      case 'admin-dashboard':
        return <AdminDashboard onNavigate={navigateTo} onOpenDbModal={() => setIsDbModalOpen(true)} />;
      default:
        return <HomePage onNavigate={navigateTo} onOpenDbModal={() => setIsDbModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans selection:bg-emerald-600 selection:text-white">
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenDbModal={() => setIsDbModalOpen(true)}
        onOpenMap={() => setIsMapOpen(true)}
      />

      <main className="flex-1">
        {renderPage()}
      </main>

      <Footer
        onNavigate={navigateTo}
        onOpenDbModal={() => setIsDbModalOpen(true)}
      />

      <ToastContainer />

      <DatabaseSetupModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
      />

      {/* Global Swiggy-Style Live Delivery Tracking Map */}
      {isMapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm animate-in fade-in">
          <DeliveryTrackingMap
            onClose={() => setIsMapOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}
