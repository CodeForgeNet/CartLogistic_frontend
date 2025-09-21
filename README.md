# Logistics Route Planning System - Frontend

This is the frontend application for the Logistics Route Planning & Simulation System. It provides a user interface for managing logistics data and running delivery simulations.

## Features

- User authentication with JWT
- Dashboard with real-time KPIs and charts
- CRUD operations for drivers, routes, and orders
- Simulation page with configurable parameters
- Visualizations for simulation results
- Responsive design for desktop and mobile

## Tech Stack

- React.js
- React Router for navigation
- React Hook Form for form handling
- Chart.js for data visualization
- Axios for API requests
- CSS for styling

## Project Structure

```

frontend/
├── public/ # Static files
├── src/
│ ├── api/ # API service layer
│ ├── components/ # Reusable UI components
│ ├── context/ # React context providers
│ ├── pages/ # Application pages
│ ├── utils/ # Utility functions
│ ├── App.css # Global styles
│ ├── App.jsx # Main app component
│ └── main.jsx # Entry point
├── .env.example # Environment variables template
├── index.html # HTML template
├── package.json # Dependencies and scripts
└── vite.config.js # Vite configuration

```

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Backend API running (see backend README)

### Installation

1. Clone the repository
2. Navigate to the frontend directory:

```

cd frontend

```

3. Install dependencies:

```

npm install

```

4. Create a `.env` file based on `.env.example`:

```

VITE_API_URL=http://localhost:5000/api

```

5. Start the development server:

```

npm run dev

```

6. Open your browser and navigate to `http://localhost:3000`

## Available Pages

- **Login:** Authentication page for users
- **Dashboard:** Overview with KPIs and charts from latest simulation
- **Drivers:** Manage driver information and status
- **Routes:** Manage delivery routes, distances, and traffic levels
- **Orders:** Manage customer orders and their assigned routes
- **Simulation:** Configure and run new delivery simulations

## Key Components

### Authentication

The application uses JWT for authentication. Tokens are stored in localStorage and automatically included in API requests via an Axios interceptor.

### Dashboard Charts

The dashboard displays two main charts:

- **Delivery Performance:** Pie chart showing on-time vs late deliveries
- **Fuel Cost Breakdown:** Bar chart showing fuel costs by traffic level

### Simulation

The simulation page allows configuring:

- Number of drivers to use
- Route start time
- Maximum hours per driver

After running a simulation, it displays:

- KPI cards with profit, efficiency, and delivery stats
- Charts visualizing the results
- Detailed order-by-order breakdown

## Data Models

### Driver

```typescript
{
name: string;
currentShiftHours: number;
past7DayHours: number[];
email: string;
isActive: boolean;
}
```

### Route

```typescript
{
  routeId: string;
  distanceKm: number;
  trafficLevel: "Low" | "Medium" | "High";
  baseTimeMinutes: number;
}
```

### Order

```typescript
{
  orderId: string;
  valueRs: number;
  assignedRouteId: string;
  deliveryTimestamp?: Date;
  status: "Pending" | "Delivered";
}
```

## Building for Production

To build the app for production:

```
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment

The frontend can be deployed to Vercel, Netlify, or any other static site hosting:

1. Connect your GitHub repository to the deployment platform
2. Set the environment variables (as listed in `.env.example`)
3. Set the build command to `npm run build`
4. Set the publish directory to `dist`

## Browser Compatibility

The application is tested and compatible with:

- Google Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
