# Arunika Agentic AI Dashboard - Setup Guide

## 🎯 Quick Start (5 minutes)

### Prerequisites
- **Node.js:** v16.x or higher ([Download](https://nodejs.org/))
- **npm:** v7.x or higher (comes with Node.js)
- **Git:** For version control ([Download](https://git-scm.com/))

### Step 1: Navigate to Project Directory

```bash
cd "P:\ArunikaTeknologiGlobal\Project\ArunikaAgentic\Arunika Agentic Ai"
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- Next.js 14
- React 18
- Three.js (3D graphics)
- Tailwind CSS (styling)
- Lucide React (icons)
- And other dependencies

**Installation time:** ~2-3 minutes depending on internet speed

### Step 3: Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env.local

# Or create .env.local manually with:
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_CACHE_DURATION=300000
NEXT_PUBLIC_ENABLE_3D=true
```

### Step 4: Start Development Server

```bash
npm run dev
```

You should see:
```
> next dev
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Step 5: Open Dashboard

Open your browser and navigate to:
```
http://localhost:3000
```

✅ **Dashboard is now running!**

---

## 🎨 First Time Setup - Theme & Preferences

1. **Theme Selection**
   - Click the sun/moon icon in the top-right corner
   - Choose Light or Dark mode
   - Preference is automatically saved

2. **Navigation**
   - Use the sidebar on the left to navigate
   - Dashboard shows real-time metrics
   - All sections are interactive

---

## 📊 Using the Dashboard

### Executive Summary
- **Daily/Monthly/Yearly:** Click buttons to switch time periods
- Shows key metrics and performance indicators
- Export reports button available

### 3D Visualization
- **Interactive 3D Chart:** Shows agent task completion rates
- Camera automatically rotates
- Colors represent different agents
- Hover to highlight specific bars

### To-Do List
- **Check off tasks** as they complete
- Progress bar shows completion percentage
- Click any task to edit or mark complete

### Cost Breakdown
- **Monthly expenses** by category
- Visual breakdown of spending
- View Details button for deeper analysis

### Performance Trends
- **Weekly performance trends**
- Interactive line chart
- Hover for detailed metrics

---

## 🔧 Development

### Project Structure

```
arunika-agentic-dashboard/
├── app/
│   ├── layout.tsx        ← Root layout with theme
│   ├── page.tsx          ← Main dashboard
│   └── globals.css       ← Global styles
├── components/
│   ├── header.tsx        ← Search & theme toggle
│   ├── sidebar.tsx       ← Navigation menu
│   ├── kpi-card.tsx      ← Metric cards
│   ├── chart-3d.tsx      ← 3D visualization
│   └── ...other components
├── package.json
└── tailwind.config.js
```

### Making Changes

1. **Edit any component** in the `components/` folder
2. **Browser automatically reloads** (Hot Module Replacement)
3. **No server restart needed**

Example: Edit `components/header.tsx` to change the header

### Common Tasks

**Add a new page:**
```bash
# Create file: app/new-page/page.tsx
'use client'
export default function NewPage() {
  return <div>Content here</div>
}
```

**Add a new component:**
```bash
# Create file: components/my-component.tsx
export function MyComponent() {
  return <div>Component content</div>
}
```

**Change colors:**
- Edit `tailwind.config.js` for theme colors
- Or use Tailwind utility classes directly

---

## 🚀 Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow prompts** to link GitHub repository and configure settings

### Deploy with Docker

1. **Create Dockerfile** (already has example in root)

2. **Build Docker image:**
   ```bash
   docker build -t arunika-dashboard .
   ```

3. **Run container:**
   ```bash
   docker run -p 3000:3000 arunika-dashboard
   ```

---

## 🔌 Connecting Real Data

### Current Status
Dashboard uses **mock data** for demonstration. To connect real APIs:

### Step 1: Create API Service

Create `services/api.ts`:
```typescript
export async function fetchDashboardData(period: 'daily' | 'monthly' | 'yearly') {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard?period=${period}`);
  if (!response.ok) throw new Error('Failed to fetch data');
  return response.json();
}
```

### Step 2: Update Component

In `app/page.tsx`:
```typescript
useEffect(() => {
  fetchDashboardData(period)
    .then(setData)
    .catch(console.error)
    .finally(() => setLoading(false))
}, [period])
```

### Step 3: Add API Endpoints

Create `app/api/dashboard/route.ts`:
```typescript
export async function GET(request: Request) {
  const period = new URL(request.url).searchParams.get('period')
  // Fetch from your database
  return Response.json({ /* data */ })
}
```

---

## 🐛 Troubleshooting

### Issue: "Port 3000 is already in use"

**Solution:**
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run dev
```

### Issue: "Module not found"

**Solution:**
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
```

### Issue: 3D Chart not rendering

**Solution:**
- Check if WebGL is enabled in browser
- Try a different browser (Chrome, Firefox)
- Check browser console for errors (F12)

### Issue: Theme not persisting

**Solution:**
- Clear browser cache
- Check if localStorage is enabled
- Check browser console for errors

### Issue: Slow performance

**Solution:**
- Close other applications
- Clear browser cache
- Restart development server
- Check network tab in DevTools

---

## 📚 Learning Resources

### Relevant Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Three.js Documentation](https://threejs.org/docs)
- [Lucide Icons](https://lucide.dev)

### Key Concepts
- **Server Components** - Pages rendered on server by default
- **Client Components** - Add `'use client'` for interactivity
- **Tailwind Utility Classes** - Style with className
- **Dark Mode** - Uses `dark:` prefix for dark theme styles

---

## 💡 Tips & Best Practices

1. **Use Tailwind Classes** instead of custom CSS when possible
2. **Keep Components Small** - Each component should do one thing
3. **Use TypeScript** - Catch errors before runtime
4. **Lazy Load Heavy Components** - Like 3D charts
5. **Optimize Images** - Use Next.js Image component
6. **Test on Mobile** - Use Chrome DevTools to test responsive design

---

## 📞 Support & Contact

- **Email:** corsec@arunika2045.com
- **Website:** arunika2045.com
- **Location:** Jl. Calung No. 7, Kota Bandung, Jawa Barat, Indonesia

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | May 2026 | Initial release with 3D visualizations, light/dark theme |

---

**Happy coding! 🚀**

Last updated: May 2026
