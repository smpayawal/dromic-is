# DROMIC-IS

<div align="center">
  <img src="public/AGAPP.png" alt="DROMIC-IS Logo" width="120" height="120">
  
  **Disaster Response Operations Monitoring and Information Center Information System**
  
  A modern web application for managing disaster response operations and monitoring critical information in the Philippines.

  [![Next.js](https://img.shields.io/badge/Next.js-15.3.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
  [![Version](https://img.shields.io/badge/Version-0.1.0-blue.svg?style=flat-square)](package.json)

</div>

## � Documentation

### Quick Access
- **[🚀 Get Started](docs/GETTING_STARTED.md)** - Installation and setup guide
- **[📖 Project Overview](docs/PROJECT_OVERVIEW.md)** - Purpose, vision, and target users
- **[⭐ Features](docs/FEATURES_DETAILED.md)** - Comprehensive feature list
- **[🏗️ Architecture](docs/PROJECT_ARCHITECTURE.md)** - Project structure and design patterns

### Development & Deployment
- **[💻 Development Guide](docs/DEVELOPMENT_GUIDE.md)** - Coding standards and best practices
- **[🎯 Three-Branch Workflow](docs/THREE_BRANCH_WORKFLOW_BEST_PRACTICES.md)** - Comprehensive Git workflow guide
- **[🔐 Authentication System](docs/AUTHENTICATION_SYSTEM.md)** - Security and database schema
- **[📡 API Reference](docs/API_REFERENCE.md)** - Complete API documentation
- **[🚀 Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - Production deployment instructions

### Support & Community
- **[🤝 Contributing](docs/CONTRIBUTING_GUIDE.md)** - How to contribute to the project
- **[📞 Support](docs/SUPPORT_GUIDE.md)** - Get help and troubleshooting
- **[📊 Project Status](docs/PROJECT_STATUS_ROADMAP.md)** - Current status and roadmap
- **[🛠️ Tech Stack](docs/TECH_STACK_DETAILED.md)** - Technology choices and configurations
- **[📋 Documentation Monitoring](docs/DOCUMENTATION_MONITORING_CHECKLIST.md)** - Maintenance checklist

## 📋 Table of Contents

- [About](#-about)
- [Quick Start](#-quick-start)
- [Key Features](#-key-features)
- [Current Status](#-current-status)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 About

DROMIC-IS is a comprehensive disaster response management system designed specifically for the Department of Social Welfare and Development (DSWD) Philippines. This modern web application streamlines disaster response operations, monitoring, and information management to enhance emergency preparedness and response effectiveness.

### Key Highlights
- **🎯 Purpose-Built**: Designed for Philippine disaster response operations
- **🔒 Enterprise Security**: JWT authentication with comprehensive audit trails
- **📱 Mobile-First**: Responsive design optimized for field operations
- **🗺️ Location-Aware**: Complete PSGC 2023 integration with 546,000+ locations
- **⚡ Real-Time**: Live updates and activity monitoring
- **🏛️ Government-Ready**: Compliance with government design and security standards

> **[Learn More →](docs/PROJECT_OVERVIEW.md)** - Detailed project vision, target users, and objectives

## ⚡ Quick Start

Get DROMIC-IS running in under 5 minutes:

```bash
# Clone the repository
git clone https://github.com/your-org/dromic-is.git
cd dromic-is

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

**Demo Access**: Visit `http://localhost:3000` and login with:
- **Username**: `admin`
- **Password**: `S4pfmel3`

> **[Complete Setup Guide →](docs/GETTING_STARTED.md)** - Detailed installation, configuration, and troubleshooting

## ⭐ Key Features

### � Authentication & Security
- Multi-step user registration with email verification
- JWT-based session management with HTTP-only cookies
- Role-based access control (9 user positions)
- Comprehensive activity logging and audit trails
- Password security with strength validation

### 👤 User Management
- Real-time profile editing with location integration
- Paginated activity logs with advanced filtering
- Account settings and notification preferences
- Global state synchronization across components

### �️ Location Intelligence
- Complete Philippine PSGC 2023 Q1 data integration
- Cascading location dropdowns (Region → Province → City → Barangay)
- 546,000+ barangays with real-time validation
- Location-based user registration and reporting

### 📊 Dashboard & Analytics
- Interactive charts for incident trends and regional activity
- Resource distribution and response time visualization
- Quick action buttons for common tasks
- Real-time statistical overview cards

> **[Explore All Features →](docs/FEATURES_DETAILED.md)** - Complete feature list with technical details

## 📈 Current Status

**Version**: `v0.1.0` | **Phase**: `Backend Integration (75% Complete)` | **Updated**: `June 1, 2025`

### ✅ Recently Completed
- **Enhanced Activity Log System** - Pagination, filtering, and performance optimization
- **Profile Management** - Real-time editing with PSGC location integration
- **Security Enhancements** - Comprehensive audit trails and password management
- **UI/UX Improvements** - Fixed navigation highlighting and auto-hide messages

### 🚧 In Progress
- DROMIC-specific data APIs and database integration
- Email service integration for notifications
- Real-time incident management system

### 🎯 Next Milestones
- **July 2025**: DROMIC Core APIs completion
- **August 2025**: Notification system implementation
- **Q3 2025**: Enhanced features and mobile optimization

> **[View Detailed Roadmap →](docs/PROJECT_STATUS_ROADMAP.md)** - Complete status, milestones, and future plans



## 🤝 Contributing

We welcome contributions from the disaster response and development communities! Whether you're fixing bugs, adding features, improving documentation, or providing feedback, your help is appreciated.

### Quick Start Contributing
```bash
# Fork and clone the repository
git clone https://github.com/your-username/dromic-is.git

# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes and commit
git commit -m "feat: add your feature description"

# Push and create a pull request
git push origin feature/your-feature-name
```

### Ways to Contribute
- 🐛 **Bug Reports** - Help us identify and fix issues
- 💡 **Feature Requests** - Suggest new functionality for disaster response
- 💻 **Code Contributions** - Submit bug fixes or new features
- 📖 **Documentation** - Improve or add documentation
- 🧪 **Testing** - Help test new features and report issues

> **[Complete Contributing Guide →](docs/CONTRIBUTING_GUIDE.md)** - Detailed guidelines, code standards, and review process

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Usage Rights
- ✅ Commercial use in disaster management operations
- ✅ Modification and distribution for organizational needs
- ✅ Private use for internal disaster response systems
- ✅ Patent use protection

### Obligations
- 📋 Include license and copyright notice in distributions
- 📋 State changes made to the code for transparency

---

<div align="center">

## 🌟 Project Vision

**"To revolutionize disaster response operations in the Philippines through innovative technology, empowering communities with real-time information and streamlined coordination for faster, more effective emergency management."**

---

### 🎯 Built For Impact

**546,000+ Locations** | **9 User Roles** | **Real-Time Updates** | **Enterprise Security**

*Designed specifically for Philippine disaster response operations*

---

**🚀 Get Started**: [Setup Guide](docs/GETTING_STARTED.md) | **📖 Learn More**: [Full Documentation](docs/) | **🤝 Contribute**: [Contributing Guide](docs/CONTRIBUTING_GUIDE.md)

**Built with ❤️ for Disaster Response Operations by the DSWD Philippines**

*"Service delayed is social justice denied!"*

</div>

