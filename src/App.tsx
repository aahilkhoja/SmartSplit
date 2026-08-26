import { HashRouter, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './lib/store'
import { PhoneFrame } from './components/PhoneFrame'
import { MinimalShell } from './components/MinimalShell'
import { AppShell } from './components/AppShell'

import { Welcome } from './routes/Welcome'
import { SignIn } from './routes/SignIn'
import { SignUp } from './routes/SignUp'
import { OnboardingAge } from './routes/onboarding/Age'
import { OnboardingStatus } from './routes/onboarding/Status'
import { OnboardingWorkType } from './routes/onboarding/WorkType'
import { OnboardingIncome } from './routes/onboarding/Income'
import { OnboardingPlan } from './routes/onboarding/Plan'
import { OnboardingDeposit } from './routes/onboarding/Deposit'

import { Dashboard } from './routes/Dashboard'
import { PlanDetail } from './routes/PlanDetail'
import { Transactions } from './routes/Transactions'
import { Subscriptions } from './routes/Subscriptions'
import { Alerts } from './routes/Alerts'
import { Learning } from './routes/Learning'
import { Statistics } from './routes/Statistics'
import { Profile } from './routes/Profile'

function App() {
  return (
    <StoreProvider>
      {/* HashRouter, not BrowserRouter: GitHub Pages serves static files with no
          server-side rewrite, so a direct link to e.g. /dashboard would 404 on
          refresh under BrowserRouter. Hash routing keeps every route resolvable
          from a single static index.html. */}
      <HashRouter>
        <PhoneFrame>
          <Routes>
            <Route element={<MinimalShell />}>
              <Route index element={<Welcome />} />
              <Route path="signin" element={<SignIn />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="onboarding/age" element={<OnboardingAge />} />
              <Route path="onboarding/status" element={<OnboardingStatus />} />
              <Route path="onboarding/work-type" element={<OnboardingWorkType />} />
              <Route path="onboarding/income" element={<OnboardingIncome />} />
              <Route path="onboarding/plan" element={<OnboardingPlan />} />
              <Route path="onboarding/deposit" element={<OnboardingDeposit />} />
            </Route>

            <Route element={<AppShell />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="plan-detail" element={<PlanDetail />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="learning" element={<Learning />} />
              <Route path="statistics" element={<Statistics />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </PhoneFrame>
      </HashRouter>
    </StoreProvider>
  )
}

export default App
