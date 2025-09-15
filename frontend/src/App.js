// import { Route, Routes, useLocation } from 'react-router-dom';
// import './App.css';
// import { FormProvider } from './context/FormContext';

// import LoginRegister from './loginpages/LoginRegister';
// import RegisterAccount from './loginpages/RegisterAccount';
// import RegisterVerifyOtp from './loginpages/RegisterVerifyOtp';

// import DashBoard from './adminpages/Dashboard/DashBoard';
// import Monitor from './adminpages/Dashboard/Monitor';
// import AllTabs from './adminpages/Dashboardddd/SideBar/Alltabs';
// import ForgotPassword from './adminpages/ForgotPassword';
// import LoginForm from './adminpages/Login';
// import ChangePassword from './adminpages/PasswordChange';
// import RegisterForm from './adminpages/Register';
// import Building from './loginpages/Building';
// import Certifications from './loginpages/Certifications';
// import CompanyOverview from './loginpages/CompanyOverview';
// import CreatePassword from './loginpages/CreatePassword';
// import DocumentsUpload from './loginpages/DocumentsUpload';
// import Electrical from './loginpages/Electrical';
// import Equipment from './loginpages/Equipment';
// import Hvac from './loginpages/Hvac';
// import OperationalData from './loginpages/OperationalData';
// import Overview from './loginpages/Overview';
// import PdfPreview from './loginpages/Pdfgenerator';
// import ProductionDetails from './loginpages/ProductionDetails';
// import Scada from './loginpages/Scada';

// function App() {
//   const location = useLocation();

//   // Add all the routes here where you don't want Header

//   return (
//     <>
//       <FormProvider>
//         <Routes>
//           <Route path="/" element={<LoginRegister />} />
//           <Route path="registerverifyotp" element={<RegisterVerifyOtp />} />
//           <Route path="registeraccount" element={<RegisterAccount />} />
//           {/* <Route path='uploadregister' element={<UploadRegister />} /> */}
//           <Route path="createpassword" element={<CreatePassword />} />
//           <Route path="/company" element={<CompanyOverview />} />
//           <Route path="/productiondetails" element={<ProductionDetails />} />
//           <Route path="/certifications" element={<Certifications />} />
//           <Route path="/documentsupload" element={<DocumentsUpload />} />
//           <Route path="/operationaldata" element={<OperationalData />} />
//           <Route path="/electrical" element={<Electrical />} />
//           <Route path="/hvac" element={<Hvac />} />
//           <Route path="/scada" element={<Scada />} />
//           <Route path="/building" element={<Building />} />
//           <Route path="/equipment" element={<Equipment />} />
//           <Route path="/overview" element={<Overview />} />
//           <Route path="/pdf-preview" element={<PdfPreview />} />
//           <Route path="/login-admin" element={<LoginForm />} />
//           <Route path="/register-admin" element={<RegisterForm />} />
//           {/* <Route path="/dashboard-admin" element={<Dashboard />} /> */}
//           <Route path="/forgot-password-admin" element={<ForgotPassword />} />
//           {/* <Route path="/admin-dash" element={<DashBoard />}>
//             <Route path="all-users" element={<AllUsers />} />
//             <Route path="all-tabs/:section" element={<AllTabs />} />
//             <Route path="change-password-admin" element={<ChangePassword />} />
//             <Route path="monitor" element={<Monitor />} />

//           </Route> */}

//           <Route path="/admin-dash" element={<DashBoard />}>
//             {/* <Route path="all-users" element={<AllUsers />} /> */}
//             <Route path="all-tabs/:section" element={<AllTabs />} />
//             <Route path="change-password-admin" element={<ChangePassword />} />
//             <Route path="monitor" element={<Monitor />} />
//           </Route>
//         </Routes>
//       </FormProvider>
//     </>
//   );
// }

// export default App;





import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { FormProvider } from './context/FormContext';
import { AuthProvider } from './context/AuthContext';
import { OrganizationProvider } from './context/OrgContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoaderSpinner from './components/common/LoaderSpinner';

import LoginRegister from './loginpages/LoginRegister';
import RegisterAccount from './loginpages/RegisterAccount';
import RegisterVerifyOtp from './loginpages/RegisterVerifyOtp';

import DashBoard from './adminpages/Dashboard/DashBoard';
import Monitor from './adminpages/Dashboard/Monitor';
import TeamMembersDashboard from './adminpages/Dashboard/TeamMembersDashboard';
import AllTabs from './adminpages/Dashboardddd/SideBar/Alltabs';
import ForgotPassword from './adminpages/ForgotPassword';
import LoginForm from './adminpages/Login';
import ChangePassword from './adminpages/PasswordChange';
import RegisterForm from './adminpages/Register';
import Building from './loginpages/Building';
import Certifications from './loginpages/Certifications';
import CompanyOverview from './loginpages/CompanyOverview';
import CreatePassword from './loginpages/CreatePassword';
import DocumentsUpload from './loginpages/DocumentsUpload';
import Electrical from './loginpages/Electrical';
import Equipment from './loginpages/Equipment';
import Hvac from './loginpages/Hvac';
import OperationalData from './loginpages/OperationalData';
import Overview from './loginpages/Overview';
import PdfPreview from './loginpages/Pdfgenerator';
import ProductionDetails from './loginpages/ProductionDetails';
import Scada from './loginpages/Scada';

// Lazy load heavy components for better performance
const CreateReport = React.lazy(() => import('./adminpages/owner/CreateReport'));

function App() {

  return (
    <ErrorBoundary>
      <AuthProvider>
        <OrganizationProvider>
          <FormProvider>
            <Suspense fallback={<LoaderSpinner fullScreen message="Loading application..." />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LoginRegister />} />
                <Route path="registerverifyotp" element={<RegisterVerifyOtp />} />
                <Route path="registeraccount" element={<RegisterAccount />} />
                <Route path="createpassword" element={<CreatePassword />} />
                <Route path="/company" element={<CompanyOverview />} />
                <Route path="/productiondetails" element={<ProductionDetails />} />
                <Route path="/certifications" element={<Certifications />} />
                <Route path="/documentsupload" element={<DocumentsUpload />} />
                <Route path="/operationaldata" element={<OperationalData />} />
                <Route path="/electrical" element={<Electrical />} />
                <Route path="/hvac" element={<Hvac />} />
                <Route path="/scada" element={<Scada />} />
                <Route path="/building" element={<Building />} />
                <Route path="/equipment" element={<Equipment />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/pdf-preview" element={<PdfPreview />} />

                {/* Auth Pages */}
                <Route path="/login-admin" element={<LoginForm />} />
                <Route path="/register-admin" element={<RegisterForm />} />
                <Route path="/forgot-password-admin" element={<ForgotPassword />} />

                {/* Admin Dashboard */}
                <Route path="/admin-dash" element={<DashBoard />}>
                  <Route index element={<Monitor />} />
                  <Route path="monitor" element={<Monitor />} />
                  <Route path="team-members" element={<TeamMembersDashboard />} />
                  <Route path="reports" element={<CreateReport />} />
                  <Route path="subscriptions" element={<Monitor />} />
                  <Route path="all-tabs/:section" element={<AllTabs />} />
                  <Route path="change-password-admin" element={<ChangePassword />} />
                </Route>
              </Routes>
            </Suspense>
          </FormProvider>
        </OrganizationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
