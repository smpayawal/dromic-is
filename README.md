# DROMIC-IS User Manual

## 1. Introduction

### Purpose
DROMIC-IS (Disaster Response Operations Monitoring and Information Center Information System - *inferred name*) is a web-based application built with Next.js and TypeScript. Its primary goal is likely related to managing and monitoring information pertinent to disaster response operations.

### Intended Audience
This manual is intended for users who will interact with the system, such as administrators, data encoders, or monitoring personnel involved in disaster response.

### Key Functionalities (Current State)
*   Secure user authentication via a dedicated login page.
*   A main application dashboard for monitoring and managing disaster response operations.
*   Responsive navigation bar for accessing dashboard, reports, and management sections.
*   Structured layout for consistent user experience.
*   Utilizes standard UI components (Buttons, Text Inputs, Checkboxes) built with Shadcn/ui conventions (inferred from `src/lib/utils.ts` and component structure).
*   Potential for data visualization using chart components.

## 2. Getting Started

### Accessing the Application
The DROMIC-IS application can be accessed via a web browser. During development, this is typically `http://localhost:3000`. For production, use the provided deployment URL.

### System Requirements
*   **Web Browser:** A modern web browser (e.g., Chrome, Firefox, Edge, Safari).
*   **Internet Connection:** Required for accessing the application.

## 3. Authentication

### Registration
1.  From the login page, click on the "Register" link.
2.  You will be directed to the registration page where you can create a new account.
3.  Fill in the required information in the registration form:
    * Email Address
    * Password and Confirm Password
    * Address
    * First Name
    * Last Name
    * Middle Initial (optional)
    * Username
    * Date of Birth
    * Phone Number
    * Position (select from: LGU, FO, CO, Encoder)
    * Division (optional)
    * Job Title
    * Location Information:
        - Region (optional)
        - Province (optional)
        - City/Municipality (optional)
        - Barangay (optional)
4.  Review and accept the Terms and Conditions.
5.  Click the "Register" button to create your account.


### Logging In
1.  Open the application URL in your browser.
2.  You will be directed to the login page (`src/app/(auth)/login/page.tsx`).
3.  Enter your credentials (e.g., email/username and password) into the login form (`src/app/(auth)/login/_components/login-form.tsx`).
4.  Click the "Login" button. The form utilizes custom hook logic (`src/lib/hooks/Login/useLoginForm.ts`) for handling submission.

#### Temporary Access Credentials

For demo or testing purposes, you may use the following credentials to access the dashboard:

* **Username:** `admin`
* **Password:** `S4pfmel3`

### Login Issues
*   **Incorrect Credentials:** Double-check your username/email and password for accuracy.
*   **Forgotten Password:** If you cannot remember your password, follow these steps to reset it:
    1. Click on the "Forgot password?" link on the login page.
    2. Enter your email address in the form and click "Send Reset Link".
    3. Check your email for a verification code and enter it on the verification page.
    4. Create a new password that meets the security requirements (minimum 8 characters).
    5. After successful reset, you'll be directed back to the login page where you can log in with your new password.

### Logging Out
[**Placeholder: Describe logout procedure, e.g., "Click the 'Logout' link in the user menu."**]

## 4. Navigating the Interface



### Main Dashboard
After logging in, the main application dashboard (`src/app/(main)/dashboard/page.tsx`) is displayed. This dashboard serves as the central hub for users to:

* View a summary and welcome message.
* Access key modules for disaster response operations.
* Monitor information and manage data relevant to their role.

#### Dashboard Sections (Current State)

- **Welcome Banner:** Displays a greeting and summary for the user.
- **Quick Access Cards:** Shortcuts to main modules (e.g., Reports, Manage Data, Services, Transparency).
- **Recent Activity/Notifications:** (If implemented) Shows latest updates or alerts.
- **Statistics/Charts:** (If implemented) Visual summary of key disaster response metrics.

The dashboard is designed for clarity and ease of use, with a clean layout and quick access to important features.


### Layout & Navigation
The application features a consistent layout defined in `src/app/layout.tsx` and `src/app/(main)/layout.tsx`. The main layout includes:

* **Navigation Bar** (`src/app/(main)/navigation/navbar.tsx`):
  - Displays the application logo and name ("DROMIC IS" and "DSWD" for tablet and below, full department name for large screens).
  - Primary navigation links:
    - **Dashboard**
    - **Reports**
    - **Manage Data**
    - **Services**
    - **Transparency**
  - **Notification Icon:** Bell icon with indicator for new notifications.
  - **User Profile Dropdown:** Access to profile, settings, and sign out.
  - **Responsive Design:**
    - On mobile: Collapsible menu, compact logo and acronym.
    - On tablet: "DROMIC IS" and "DSWD" shown, navigation links with optimized font size.
    - On desktop: Full department name, expanded navigation.
  - **Accessibility:** Uses ARIA labels, keyboard navigation, and focus indicators.
  - **Styling:** Tailwind CSS and `lucide-react` icons.

* **Main Content Area:** Displays the current page or module selected from the navigation bar.

The navigation bar is rendered in the main layout and is accessible on all authenticated pages, ensuring users can easily move between sections.

## 5. Core Features (Based on Current Structure)



### Viewing Information
Users can view data and reports by navigating through the dashboard and using the navigation bar. Key sections include:

* **Dashboard:** Overview and quick access to main features.
* **Reports:** Access to disaster response reports and analytics.
* **Manage Data:** Sections for managing relevant information (e.g., user profiles, locations, etc.).
* **Services:** (If implemented) Access to disaster response services or tools.
* **Transparency:** (If implemented) Information on transparency, accountability, or public disclosures.

Navigation links are available in the navigation bar for easy access to these sections.


### Data Visualization (Potential)
Chart components are located in `src/components/charts`. Once implemented, these will provide visual representations of key data points or trends, such as incident statistics, response times, and resource allocation.
## 8. Navigation Component Details

The navigation system is implemented in `src/app/(main)/navigation/`:

* **Navbar (`navbar.tsx`)**: A responsive top navigation bar with:
  - Application logo and name
  - Primary navigation links
  - Optional search bar and notification icon
  - User profile dropdown (profile, settings, sign out)
  - Mobile-friendly collapsible menu
  - Accessibility features (ARIA labels, roles)

* **Usage**: The `Navbar` is imported and rendered in the main layout (`src/app/(main)/layout.tsx`), ensuring it appears on all main application pages after login.

* **Customization**: The navigation bar can be extended with additional links or features as the application grows. See `src/app/(main)/navigation/README.md` for more details and future enhancement plans.

### Using UI Components
The interface uses reusable components found in `src/components/ui`:
*   **Buttons (`button.tsx`):** For actions like submitting forms or confirming operations.
*   **Text Inputs (`text-input.tsx`):** For entering textual data.
*   **Checkboxes (`checkbox.tsx`):** For selecting boolean options.

## 6. Troubleshooting

### Common Issues
*   **Login Failure:** Verify credentials. Contact an administrator if issues persist.
*   **Slow Loading:** Check internet connection. Refresh the page.

### Frequently Asked Questions (FAQs)
[**Placeholder: Add FAQs as needed.**]
*   **Q:** How is user input validated?
    *   A: [**Placeholder: Explain validation if known, e.g., using Zod based on typical Next.js practices.**]

## 7. Support

For technical support or to report problems, please contact [**Placeholder: Provide contact information or procedure.**]

---
*Manual based on project structure observed on May 2, 2025.*
