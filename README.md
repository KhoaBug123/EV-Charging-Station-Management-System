# 🚗⚡ SkaEV - Smart EV Charging Management Platform

## 📋 Project Overview

SkaEV is a comprehensive Elect├── pages/ # Page components organized by role
│ ├── auth/ # Authentication pages
│ ├── public/ # Public pages (Home, etc.)
│ ├── admin/ # Admin dashboard pages
│ ├── staff/ # Staff dashboard pages  
│ └── customer/ # Customer dashboard pagesicle (EV) Charging Management System built with React and Material-UI. The platform provides role-based functionality for Customers, Station Owners, Staff, and Administrators to manage EV charging operations efficiently.

## 🚀 Key Features

### 👥 Multi-Role System

- **Customer**: Find stations, book charging sessions, manage payments
- **Staff**: Monitor stations, handle maintenance, technical support
- **Admin**: Full system control, user management, comprehensive reporting

### ⚡ Core Functionalities

- **Real-time Station Monitoring**: Live status of all charging stations
- **Smart Booking System**: Reserve charging slots in advance
- **Payment Integration**: Digital wallet and payment method management
- **Advanced Analytics**: Revenue tracking, usage statistics, performance metrics
- **Maintenance Management**: Schedule and track maintenance activities
- **Notification System**: Real-time alerts and system notifications
- **Responsive Design**: Mobile-first approach with Material-UI

## 🛠️ Technology Stack

### Frontend

- **React 19**: Latest React with hooks and modern patterns
- **Material-UI v6**: Component library for professional UI
- **React Router v6**: Client-side routing with nested routes
- **Zustand**: State management for authentication and notifications
- **Recharts**: Data visualization and analytics charts
- **React Query**: Server state management
- **Vite**: Fast build tool and development server

### Development Tools

- **ESLint**: Code linting and formatting
- **CSS-in-JS**: Styled components with MUI theme system
- **Mock Data**: Comprehensive mock API for development

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd SkaEV_SWP_Project

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

## 🔐 Demo Accounts

### Test the application with these demo accounts:

| Role         | Email                | Password       | Description                      |
| ------------ | -------------------- | -------------- | -------------------------------- |
| **Admin**    | `admin@skaev.com`    | `Admin123!`    | Full system access               |
| **Staff**    | `staff@skaev.com`    | `Staff123!`    | Station management & maintenance |
| **Customer** | `john.doe@gmail.com` | `Customer123!` | Customer features                |

## 📱 Features by Role

### 👤 Customer Features

- **Dashboard**: Personal charging statistics and quick actions
- **Find Stations**: Interactive map with real-time availability
- **Booking History**: Complete history with filtering and details
- **Payment Methods**: Credit cards and digital wallet management
- **Profile Management**: Personal information and preferences

### 👨‍🔧 Staff Features

- **Operations Dashboard**: Real-time station monitoring
- **Station Management**: Technical control of chargers and equipment
- **Maintenance Scheduling**: Plan and track maintenance activities
- **Work Profile**: Certifications, performance metrics, activity log

### 👨‍💻 Admin Features

- **System Dashboard**: Complete platform overview
- **User Management**: CRUD operations for all user types
- **Advanced Analytics**: System-wide performance metrics
- **Station Management**: Global station monitoring and control
- **System Reports**: Comprehensive reporting with export functionality
- **Settings**: System configuration and security settings
- **Notification Dashboard**: System-wide alert management

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   └── layout/          # Layout components (Header, Sidebar, etc.)
├── pages/               # Page components organized by role
│   ├── auth/           # Authentication pages
│   ├── public/         # Public pages (Home, etc.)
│   ├── admin/          # Admin dashboard pages
│   ├── staff/          # Staff dashboard pages
│   ├── owner/          # Owner dashboard pages
│   └── customer/       # Customer dashboard pages
├── store/              # Zustand stores for state management
├── theme/              # Material-UI theme configuration
├── data/               # Mock data and API simulation
└── utils/              # Utility functions and helpers
```

## 🎨 Design System

### Theme

- **Primary Color**: Blue (#1379FF) - Trust and technology
- **Secondary Color**: Green (#B5FF3D) - Sustainability and energy
- **Typography**: Roboto font family with multiple weights
- **Spacing**: 8px base unit with consistent spacing scale

### Components

- **Cards**: Elevated surfaces for content grouping
- **Charts**: Professional data visualization with Recharts
- **Tables**: Sortable and filterable data tables
- **Forms**: Validated forms with real-time feedback
- **Navigation**: Responsive sidebar with role-based menu items

## 📊 Data Visualization

### Analytics Features

- **Revenue Trends**: Line and area charts showing financial performance
- **Usage Statistics**: Bar charts and pie charts for utilization data
- **System Health**: Progress indicators and status metrics
- **Performance Metrics**: KPI cards with trend indicators

### Chart Types

- Line Charts: Trend analysis over time
- Area Charts: Revenue and usage visualization
- Bar Charts: Comparative data analysis
- Pie Charts: Distribution and breakdown data
- Progress Bars: Status and completion indicators

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Style

- ESLint configuration for consistent code style
- Prettier integration for automatic formatting
- Component naming: PascalCase for components
- File naming: camelCase for utilities, PascalCase for components

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Create `.env` file in root directory:

```env
VITE_API_URL=your_api_url
VITE_MAPS_API_KEY=your_maps_key
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Development Team

- **Frontend Development**: React + Material-UI implementation
- **UI/UX Design**: Modern, responsive design system
- **Data Visualization**: Advanced analytics and reporting
- **State Management**: Efficient state handling with Zustand

## 🎯 Future Enhancements

- [ ] Real-time WebSocket integration
- [ ] Mobile app development (React Native)
- [ ] IoT integration for actual charging station hardware
- [ ] Machine learning for predictive analytics
- [ ] Multi-language support expansion
- [ ] Advanced payment gateway integration

---

**SkaEV** - Powering the future of electric vehicle charging management 🚗⚡
