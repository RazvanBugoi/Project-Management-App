# Deployment Guide

## Backend Deployment (Heroku)

The backend is deployed on Heroku at: https://stormy-sierra-99558-4b6090850d52.herokuapp.com/

### Environment Variables
Required environment variables in Heroku:
- `DATABASE_URL`: PostgreSQL database URL
- `JWT_SECRET`: Secret key for JWT token generation
- `NODE_ENV`: Set to 'production'
- `PORT`: Set by Heroku automatically

### Deployment Steps
1. Login to Heroku CLI:
```bash
heroku login
```

2. Add Heroku remote:
```bash
cd backend
heroku git:remote -a stormy-sierra-99558
```

3. Deploy to Heroku:
```bash
git push heroku main
```

4. Check logs:
```bash
heroku logs --tail --app stormy-sierra-99558
```

### Troubleshooting
- If deployment fails, check Heroku logs for errors
- For database issues, use `heroku pg:psql` to connect directly to the database
- For application crashes, check the error logs and verify environment variables
- If needed, rollback to a previous working version using `heroku rollback v[version-number]`

## Frontend Deployment (Heroku)

The frontend is deployed on Heroku at: https://project-management-frontend-131512083ed4.herokuapp.com/

### Environment Variables
Required environment variables in Heroku:
- `VITE_API_URL`: Backend API URL (https://stormy-sierra-99558-4b6090850d52.herokuapp.com/api)
- `NODE_ENV`: Set to 'production'

### Deployment Steps
1. Login to Heroku CLI:
```bash
heroku login
```

2. Add Heroku remote:
```bash
cd frontend
heroku git:remote -a project-management-frontend
```

3. Deploy to Heroku:
```bash
git push heroku main
```

4. Check logs:
```bash
heroku logs --tail --app project-management-frontend
```

### Troubleshooting
- Verify CORS settings in backend allow frontend domain
- Check browser console for API connection errors
- Verify environment variables are set correctly
- For build failures, check the build logs in Heroku
- If needed, rollback to a previous working version using `heroku rollback v[version-number]`

## Version Control

### Current Working Version (December 24, 2024)

Backend (v92):
- Database schema includes all necessary tables (projects, applications, quotes, consultants, topic_areas, etc.)
- Quote functionality fully implemented with topic area support
- Admin user properly initialized with secure credentials
- JWT authentication working correctly
- All API endpoints properly configured and tested

Frontend:
- All components properly configured (Dashboard, Projects, Applications, Quotes, etc.)
- MainLayout includes all necessary navigation items
- Authentication flow working correctly
- API integration properly configured with environment variables

Key Components:
1. Database Schema:
   - All tables created and relationships established
   - Topic areas properly linked to quotes
   - Migrations up to 012.1_add_topic_area_to_quotes.sql applied

2. Backend Features:
   - Authentication with JWT
   - CORS configured for frontend domain
   - All CRUD operations for quotes and related entities
   - Admin user initialization script

3. Frontend Features:
   - Complete navigation structure
   - Quote management interface
   - Integration with backend API
   - Protected routes and authentication

When making changes:
1. Create a new branch from this version
2. Test changes locally first
3. Deploy to staging if available
4. Deploy to production
5. Monitor logs for any issues
6. Be prepared to rollback if needed

### Rollback Information
If issues arise, you can rollback to these versions:
- Backend: v92 (current stable version)
- Frontend: Latest version is stable

### Development Workflow
1. Always branch from this stable version when implementing new features
2. Test thoroughly before merging back to main
3. Keep track of any schema changes in migrations
4. Update documentation when making significant changes