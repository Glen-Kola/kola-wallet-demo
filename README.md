# Kola Wallet Design Overview

This is a code bundle for Kola Wallet Design Overview. The original project is available at https://www.figma.com/design/wiP2nqtWWrZql4KYa6rjfk/Kola-Wallet-Design-Overview.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## About the Kola Wallet

The Vision: A Unified Financial Ecosystem A high-performance, minimalist fintech mobile app designed for seamless money movement across borders and platforms. The core interface features a clean, "neobank" aesthetic (think Revolut meets CashApp) with a focus on speed and transparency. The Home Dashboard is anchored by a visually distinct "Smart Card" displaying the user's real-time balance (synced from Firestore) with a privacy toggle. Below the card, a "Quick Action" dock provides immediate access to high-frequency tasks: Local Transfer (MoMo, Orange Money), International Wire, and Payins. The design language uses generous whitespace, subtle shadows for depth, and a trustworthy color palette (e.g., deep slate blues with vibrant green accent buttons) to convey security and financial accuracy.

Community & Business Hubs Beyond simple transfers, the app includes a dedicated "Growth" tab for Savings and Organizations. This section utilizes data-rich UI elements like progress rings and stacked cards to visualize Personal Savings goals and Group Savings (Tontines). For Organizations and Payroll, the interface shifts to a structured, professional view with role-based dashboards. Managers see collapsible lists for mass payments and payroll disbursements, allowing for "bulk approval" actions via swipe gestures. Visual indicators—such as distinct badges or color-coded headers—clearly differentiate between personal, group, and business contexts, ensuring the user never confuses their personal funds with company money.

Native Interactivity & Security The user experience prioritizes "Optimistic UI" principles, where interactions feel instant. Transaction flows (entering amounts, selecting recipients) should utilize bottom sheets and modal overlays rather than full-page navigations to keep the user grounded in the context. Security is visualized through a polished Biometric Login screen and a "Security Center" with toggle switches for role management and transaction limits. Finally, the design system extends to Native Home Screen Widgets, requiring a simplified, high-contrast version of the wallet card and "Favorite Contacts" bubbles that adhere strictly to Apple Human Interface Guidelines and Google Material Design 3 for a truly native feel.
