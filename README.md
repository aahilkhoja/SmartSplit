# SmartSplit

> "Your paycheck gets a plan before you spend it."

A mobile-app prototype (built as a phone-framed React web app, not React Native) that routes a
paycheck into **Spend / Save / Invest** accounts the moment it lands, based on a short onboarding
questionnaire — instead of manual, ongoing budgeting.

## Who it's for

International students working part-time, or new earners who don't yet know what to do with
their money — people who've abandoned other budgeting apps because they demanded constant manual
tracking, and who find investing intimidating.

## What it does / does not do

- Asks a few onboarding questions (residency status, work type, income) and recommends a plan.
- Distributes simulated deposits into the user's Spend, Save, and Invest accounts.
- **Does not** own the user's money, promise returns, or replace financial advice.
- The user is in control of everything — SmartSplit only routes and recommends.

This is a **prototype**: no backend, no real accounts, no real bank integration, no real trading.
Sign In / Sign Up are mock-only — any email/password "succeeds," and no credential is ever
persisted. All state lives in the browser's `localStorage`.

## The Big 3 — plan model

| Plan | Spend | Save | Invest |
| --- | --- | --- | --- |
| The Saver | 50% | 50% | — |
| The Growth | 25% | 25% | 50% |
| Custom | user-defined split | | |

## Key features

- **Monthly spend-limit notification** — a system-style banner (not an in-app warning bar) fires
  the moment simulated spending crosses your guideline, and logs to Notifications.
- **Subscription Scanner** — detects recurring charges from transaction history.
- **Learning panel** — plain-language breakdown of what the Invest bucket holds, plus a simulated
  growth projection (explicitly not a promise).

## Screens

Welcome → Sign In / Sign Up → Onboarding (Status, Work Type, Income, Plan, Deposit) → Allocation
Dashboard, plus Plan Detail, Transactions, Subscription Scanner, Notifications, Learning,
Statistics, and Profile — reachable via the bottom tab bar and dashboard quick links.

## Brand

Fixed dark theme — `#060B12` background, `#36F1C7` / `#00D4FF` accents, `#FF6B5B` for alerts.
Fredoka One for headings, Inter for body text. Tone: conversational, informed, friendly.

## Stack

React + TypeScript + Vite, Tailwind CSS v4, React Router, Recharts. No backend.

## Running it

```bash
npm install
npm run dev
```

Open the printed local URL. Reset all simulated data via **Profile → Reset everything** (or clear
the `smartsplit.state.v2` key in your browser's localStorage).

## Project structure

```
src/
  routes/
    onboarding/     Status, WorkType, Income, Plan, Deposit
    Welcome, SignIn, SignUp, Dashboard, PlanDetail, Transactions,
    Subscriptions, Alerts, Learning, Statistics, Profile
  components/
    PhoneFrame, MinimalShell, AppShell, BottomTabBar, NotificationToast,
    OnboardingLayout, PlanChoiceCard, BucketCard, SplitSliders,
    TransactionList, SubscriptionPanel, GrowthChart, SpendLimitMeter,
    DisclaimerFooter
  lib/
    store.tsx          React Context + localStorage-backed app state (incl. mock auth, alerts)
    splitEngine.ts      The Big 3 plan definitions + recommendation nudge
    growthSim.ts        Mock compound-growth simulation
    subscriptions.ts    Recurring-charge detection heuristic
    spend.ts            Monthly spend-cycle calculation
    mockData.ts         Seed transactions/balances, category & investment breakdowns, income trend
  types.ts          Shared TypeScript types
```
