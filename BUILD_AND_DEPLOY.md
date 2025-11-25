# Build and Deployment Guide

## 🚀 Quick Start

### Development Mode
```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
```

This creates an optimized production build in the `dist` directory with:
- Minified JavaScript and CSS
- Console logs stripped
- Code splitting applied
- Asset optimization
- Source maps (optional)

### Preview Production Build
```bash
npm run preview
```

Test the production build locally before deployment.

## 📦 Build Configuration

### Vite Configuration
The project uses Vite with the following optimizations:

```typescript
{
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,        // Remove console.log
        drop_debugger: true,       // Remove debugger statements
        pure_funcs: [              // Remove specific functions
          'console.log',
          'console.info',
          'console.debug',
          'console.trace'
        ]
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    }
  }
}
```

### What Gets Optimized

1. **JavaScript**
   - Minified with Terser
   - Tree-shaking removes unused code
   - Code splitting by route and library
   - Dead code elimination

2. **CSS**
   - Tailwind CSS purged of unused classes
   - Minified and combined
   - Critical CSS inlined

3. **Assets**
   - Images optimized
   - Fonts preloaded
   - Static assets fingerprinted for caching

4. **Security**
   - All console.* calls removed
   - Debug statements stripped
   - Source maps optional (disable for production)

## 🔒 Production Checklist

Before deploying to production:

- [ ] Run `npm run build` successfully
- [ ] Test with `npm run preview`
- [ ] Verify no console logs in browser DevTools
- [ ] Test CEO access (Shift + Ctrl + M)
- [ ] Confirm CEO button is nearly invisible
- [ ] Test all authentication flows
- [ ] Verify responsive design on mobile
- [ ] Check for TypeScript errors
- [ ] Validate all forms work
- [ ] Test error boundaries
- [ ] Confirm animations are smooth
- [ ] Check performance metrics

## 🌐 Deployment Options

### Option 1: Spark Platform (Recommended)
The application is designed to run on the Spark platform with automatic deployment.

### Option 2: Static Hosting
Deploy the `dist` folder to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Azure Static Web Apps
- Google Cloud Storage

### Option 3: Docker Container
```dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Option 4: Node Server
```bash
npm install -g serve
serve -s dist -p 3000
```

## ⚙️ Environment Configuration

### No Environment Variables Required
This application uses runtime configuration via the Spark SDK. No `.env` file is needed for basic functionality.

### Optional Configuration
If needed, create `.env.local`:
```bash
VITE_APP_TITLE=ApexForge
VITE_APP_VERSION=1.0.0
```

### Runtime Configuration
All API keys and sensitive configuration are managed through:
1. The application UI (Settings/Dashboard)
2. Spark KV storage (persistent, encrypted)
3. User input at runtime

## 🔧 Build Troubleshooting

### Issue: Build Fails with TypeScript Errors
```bash
# Check for type errors
npx tsc --noEmit

# Fix automatically (if possible)
npm run lint:fix
```

### Issue: Large Bundle Size
```bash
# Analyze bundle
npm run build -- --analyze

# Check what's included
npx vite-bundle-visualizer
```

### Issue: Missing Dependencies
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build Succeeds but Runtime Errors
1. Check browser console for errors
2. Verify all imports are correct
3. Ensure dynamic imports have proper error handling
4. Test with `npm run preview` before deploying

## 📊 Performance Optimization

### Automatic Optimizations
- ✅ Code splitting by route
- ✅ Lazy loading of components
- ✅ Tree-shaking unused code
- ✅ Minification of all assets
- ✅ CSS purging via Tailwind
- ✅ Asset fingerprinting for caching

### Manual Optimizations Available
- Convert large images to WebP
- Use `loading="lazy"` for images
- Implement virtual scrolling for long lists
- Use React.memo for expensive components
- Optimize Framer Motion animations

### Measuring Performance
```javascript
// Check Core Web Vitals
window.addEventListener('load', () => {
  const perfData = performance.getEntriesByType('navigation')[0]
  console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart)
  console.log('DOM Interactive:', perfData.domInteractive)
})
```

## 🎯 Deployment Best Practices

### 1. Pre-Deployment Testing
```bash
# Run all checks
npm run build
npm run preview
npm run lint
npm test # if tests are configured
```

### 2. Performance Targets
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.8s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms

### 3. Browser Support
- Chrome/Edge (Chromium): Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 13+, Chrome Mobile

### 4. CDN Configuration
For optimal performance, configure your CDN:
```nginx
# Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

# Don't cache HTML
location / {
  expires -1;
  add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

### 5. Security Headers
```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
```

## 🚦 CI/CD Pipeline Example

### GitHub Actions
```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm run preview &
      - run: sleep 5
      - run: curl http://localhost:4173 # Health check
```

## 📈 Monitoring Production

### Key Metrics to Track
1. Error rate (via error boundary)
2. Page load times
3. API response times
4. User engagement
5. Conversion rates

### Error Monitoring
Implement error tracking:
```typescript
// In main.tsx or App.tsx
window.addEventListener('error', (event) => {
  // Send to your error tracking service
  // e.g., Sentry, LogRocket, etc.
})

window.addEventListener('unhandledrejection', (event) => {
  // Track unhandled promise rejections
})
```

## ✅ Production Deployment Checklist

**Pre-Deployment:**
- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build succeeds without warnings
- [ ] Performance benchmarks met
- [ ] Security scan completed
- [ ] Documentation updated

**Deployment:**
- [ ] Create production build
- [ ] Test production build locally
- [ ] Deploy to staging environment
- [ ] Run smoke tests on staging
- [ ] Deploy to production
- [ ] Verify production deployment

**Post-Deployment:**
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify all features working
- [ ] Monitor server resources
- [ ] Check analytics for issues

## 🎉 Success!

Your ApexForge application is now production-ready and optimized for deployment!

For support or questions, refer to:
- `PRODUCTION_RELEASE_VERIFICATION.md` - Verification checklist
- `README.md` - Application overview
- `PRD.md` - Product requirements
