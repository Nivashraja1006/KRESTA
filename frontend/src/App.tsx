import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BranchProvider } from './context/BranchContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AppLayout } from './layouts/AppLayout';

// Public Marketing Pages
import { LandingPage } from './pages/public/LandingPage';
import { PlatformPage } from './pages/marketing/PlatformPage';
import { AIIntelligencePage } from './pages/marketing/AIIntelligencePage';
import { SolutionsPage } from './pages/marketing/SolutionsPage';
import { MarketingAnalyticsPage } from './pages/marketing/MarketingAnalyticsPage';
import { FeaturesPage } from './pages/marketing/FeaturesPage';
import { AboutPage } from './pages/marketing/AboutPage';
import { ContactPage } from './pages/marketing/ContactPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Customer Food Ordering Pages
import { OrderPage } from './pages/order/OrderPage';
import { CartPage } from './pages/order/CartPage';
import { CheckoutPage } from './pages/order/CheckoutPage';
import { OrderConfirmationPage } from './pages/order/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/order/OrderTrackingPage';
import { AccountPage } from './pages/order/AccountPage';

// In-App Protected Pages inside AppLayout
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { OrdersPage } from './pages/orders/OrdersPage';
import { KitchenPage } from './pages/kitchen/KitchenPage';
import { MenuPage } from './pages/menu/MenuPage';
import { InventoryPage } from './pages/inventory/InventoryPage';
import { ForecastPage } from './pages/forecast/ForecastPage';
import { RecommendationsPage } from './pages/recommendations/RecommendationsPage';
import { WastePage } from './pages/waste/WastePage';
import { CustomersPage } from './pages/customers/CustomersPage';
import { ReviewsPage } from './pages/reviews/ReviewsPage';
import { AnomaliesPage } from './pages/anomalies/AnomaliesPage';
import { AIAssistantPage } from './pages/ai-assistant/AIAssistantPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { SuppliersPage } from './pages/suppliers/SuppliersPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { UsersPage } from './pages/admin/UsersPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { ProfilePage } from './pages/profile/ProfilePage';

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <BranchProvider>
          <CartProvider>
            <Routes>
              {/* Public Marketing Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/platform" element={<PlatformPage />} />
              <Route path="/ai-intelligence" element={<AIIntelligencePage />} />
              <Route path="/solutions" element={<SolutionsPage />} />
              <Route path="/analytics" element={<MarketingAnalyticsPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Customer Food Ordering Experience Flow */}
              <Route path="/order" element={<OrderPage />} />
              <Route path="/order/cart" element={<CartPage />} />
              <Route path="/cart" element={<Navigate to="/order/cart" replace />} />
              <Route path="/order/checkout" element={<CheckoutPage />} />
              <Route path="/checkout" element={<Navigate to="/order/checkout" replace />} />
              <Route path="/order/confirmation/:orderId" element={<OrderConfirmationPage />} />
              <Route path="/order/track/:orderId" element={<OrderTrackingPage />} />
              <Route path="/order/account" element={<AccountPage />} />
              <Route path="/account" element={<Navigate to="/order/account" replace />} />

              {/* Authentication Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Protected Routes inside AppLayout (Restaurant Operations & Executive Command) */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/executive-analytics" element={<AnalyticsPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/kitchen" element={<KitchenPage />} />
                  <Route path="/menu" element={<MenuPage />} />
                  <Route path="/inventory" element={<InventoryPage />} />
                  <Route path="/forecast" element={<ForecastPage />} />
                  <Route path="/recommendations" element={<RecommendationsPage />} />
                  <Route path="/waste" element={<WastePage />} />
                  <Route path="/customers" element={<CustomersPage />} />
                  <Route path="/reviews" element={<ReviewsPage />} />
                  <Route path="/anomalies" element={<AnomaliesPage />} />
                  <Route path="/ai-assistant" element={<AIAssistantPage />} />
                  <Route path="/suppliers" element={<SuppliersPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/admin/users" element={<UsersPage />} />
                  <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>
              </Route>

              {/* Fallback Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </BranchProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
