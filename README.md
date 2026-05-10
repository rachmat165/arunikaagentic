# Arunika Agentic AI Dashboard

A comprehensive, real-time dashboard for monitoring and managing Arunika's Agentic AI system with 3D visualizations, cost tracking, executive summaries, and **complete Cowork workflow automation integration**.

> **NEW: Full Cowork Integration!** This dashboard now includes 12+ automated workflows across 4 Cowork instances. See [COWORK_INTEGRATION_SUMMARY.md](./COWORK_INTEGRATION_SUMMARY.md) for details.

## 🚀 Features

### Dashboard & Monitoring
- **Executive Summary Dashboard** - Daily, Monthly, Yearly metrics and insights
- **3D Performance Visualization** - Interactive Three.js visualizations of agent performance
- **Real-time Metrics** - Monitor total agents, active tasks, costs, and success rates
- **To-Do List Management** - Track tasks across all AI agents
- **Cost & Budget Tracking** - Detailed breakdown of expenses by category
- **Performance Trends** - Weekly/monthly trend analysis with interactive charts
- **Light/Dark Theme** - Fully responsive with theme support
- **Responsive Design** - Works seamlessly on desktop and mobile devices

### 🔗 Cowork Integration
- **12+ Automated Workflows** - Social media, email campaigns, invoice processing, payroll, reports
- **4 Cowork Instances** - Central Hub, Sales-Marketing, Finance-Operations, CEO Dashboard
- **Real-Time Execution** - Execute workflows on-demand or on schedule
- **Performance Monitoring** - Success rates, execution times, health checks, statistics
- **Automatic Scheduling** - Daily (08:00 WIB), Weekly (Monday 10:00), Monthly (1st of month)
- **Complete API** - RESTful endpoints for workflow management and automation
- **Unified Monitoring Dashboard** - See all workflows and their status in one place

## 📋 Requirements

- Node.js 16.x or higher
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🛠️ Installation & Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Run Development Server

```bash
npm run dev
# or
yarn dev
```

The application will start at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
arunika-agentic-dashboard/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles
├── components/
│   ├── header.tsx          # Top navigation bar
│   ├── sidebar.tsx         # Side navigation menu
│   ├── kpi-card.tsx        # KPI metric cards
│   ├── dashboard-card.tsx  # Card wrapper component
│   ├── chart-3d.tsx        # 3D visualization (Three.js)
│   ├── todo-list.tsx       # Task management list
│   ├── cost-breakdown.tsx  # Cost analysis
│   ├── trend-chart.tsx     # Performance trends
│   ├── executive-summary.tsx # Summary reports
│   └── theme-provider.tsx  # Theme context provider
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

## 🎨 Design System

### Color Palette

**Light Theme:**
- Background: `#FFFFFF`
- Surface: `#F5F7FA`
- Primary: `#6366F1` (Indigo)
- Success: `#10B981` (Green)

**Dark Theme:**
- Background: `#0F1419`
- Surface: `#1A1F2E`
- Primary: `#818CF8` (Light Indigo)
- Success: `#34D399` (Light Green)

### Typography

- Font: Inter (system fallback)
- Headings: Bold (700)
- Body: Regular (400)
- Labels: Medium (500)

## 📊 3D Visualization

The dashboard includes an interactive 3D bar chart using Three.js that visualizes:
- Agent task completion rates
- Real-time performance metrics
- Animated camera rotation
- Responsive to window resize

Features:
- Smooth animations
- Gradient materials
- Dynamic lighting
- Grid helper for reference

## 🌓 Theme Support

The dashboard supports both light and dark modes with:
- System preference detection
- Manual theme toggle in header
- Persistent theme storage
- Smooth transitions

Toggle theme using the sun/moon icon in the header.

## 🔄 Data Integration

The dashboard currently uses mock data. To integrate with real APIs:

1. Create an API service in `services/api.ts`:

```typescript
export async function fetchDashboardData(period: 'daily' | 'monthly' | 'yearly') {
  const response = await fetch(`/api/dashboard?period=${period}`);
  return response.json();
}
```

2. Update `app/page.tsx` to use real API calls instead of mock data.

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t arunika-dashboard .
docker run -p 3000:3000 arunika-dashboard
```

## 📦 Dependencies

- **Next.js 14** - React framework
- **React 18** - UI library
- **Three.js** - 3D graphics
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **next-themes** - Theme management

## 🎯 Keyboard Shortcuts

- `Ctrl/Cmd + K` - Search (implement in header)
- `Ctrl/Cmd + /` - Show theme toggle
- `Ctrl/Cmd + J` - Jump to section

## 🔒 Security

- Environment variables for API keys (create `.env.local`)
- CORS headers for API requests
- Input validation on forms
- XSS protection through React

## 📈 Performance Optimization

- Image optimization with Next.js
- Code splitting and lazy loading
- Memoized components to prevent re-renders
- CSS-in-JS with Tailwind for smaller bundle size

## 🐛 Troubleshooting

### Issue: 3D Chart not rendering

**Solution:** Ensure WebGL is enabled in your browser and hardware acceleration is turned on.

### Issue: Theme not persisting

**Solution:** Check that localStorage is not disabled in browser settings.

### Issue: High memory usage

**Solution:** Three.js canvas uses GPU memory. Close other applications and restart the browser if needed.

## 📞 Support

For issues or questions, contact: corsec@arunika2045.com

## 📝 License

© 2026 PT. Arunika Teknologi Global. All rights reserved.

---

**Last Updated:** May 2026
**Version:** 1.0.0
**Status:** Production Ready ✅
