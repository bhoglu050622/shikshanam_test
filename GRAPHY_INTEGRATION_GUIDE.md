# Graphy API Integration Guide

## Overview
This guide explains how to use the complete Graphy API integration that has been implemented in your Shikshanam application. The integration provides seamless connection between your packages, learner management, and Graphy's course delivery platform.

## 🚀 What's Been Implemented

### 1. Core Services
- **`GraphyAPIService`** - Direct API communication with Graphy
- **`GraphyPackageIntegrationService`** - Maps Shikshanam packages to Graphy products
- **React Hooks** - Easy-to-use hooks for components

### 2. Authentication Integration
- Automatic learner creation in Graphy when users log in
- Seamless user data synchronization
- Graphy learner ID stored in user context

### 3. Package Management
- Package enrollment through Graphy
- Progress tracking and analytics
- Live session management
- Certificate status tracking

### 4. User Dashboard
- Complete learning dashboard with Graphy data
- Progress visualization
- Device management tools
- Live session scheduling

## 📁 File Structure

```
lib/
├── services/
│   ├── graphy-api.ts                    # Core Graphy API service
│   └── graphy-package-integration.ts    # Package integration service
├── hooks/
│   └── useGraphyIntegration.ts          # React hooks for Graphy
└── auth-context.tsx                     # Updated with Graphy integration

components/
├── packages/
│   └── GraphyPackageDetail.tsx          # Package detail with Graphy integration
└── dashboard/
    └── GraphyUserDashboard.tsx          # User dashboard with Graphy data

app/
├── api/graphy/
│   ├── learners/                        # Learner management endpoints
│   └── packages/[sku]/                  # Package-specific endpoints
├── dashboard/page.tsx                   # User dashboard page
└── packages/[sku]/graphy/page.tsx       # Graphy-integrated package page
```

## 🔧 How to Use

### 1. Basic Package Integration

```tsx
import { useGraphyPackage } from '@/lib/hooks/useGraphyIntegration'

function PackageComponent({ sku }: { sku: string }) {
  const { progress, usage, liveSessions, isLoading, error } = useGraphyPackage(sku)
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      <h2>Progress: {progress?.usage?.sessions || 0} sessions</h2>
      <h3>Live Sessions: {liveSessions.length}</h3>
    </div>
  )
}
```

### 2. User Package Management

```tsx
import { useGraphyPackages } from '@/lib/hooks/useGraphyIntegration'

function UserPackages() {
  const { packages, enrollInPackage, isLoading } = useGraphyPackages()
  
  const handleEnroll = async (sku: string) => {
    await enrollInPackage(sku)
  }
  
  return (
    <div>
      {packages.map(pkg => (
        <div key={pkg.sku}>
          <h3>{pkg.name}</h3>
          <p>Progress: {pkg.progress}%</p>
          <button onClick={() => handleEnroll(pkg.sku)}>
            Enroll
          </button>
        </div>
      ))}
    </div>
  )
}
```

### 3. Enrollment Flow

```tsx
import { useGraphyEnrollment } from '@/lib/hooks/useGraphyIntegration'

function EnrollmentButton({ sku }: { sku: string }) {
  const { enroll, getEnrollmentStatus, getEnrollmentError } = useGraphyEnrollment()
  
  const status = getEnrollmentStatus(sku)
  const error = getEnrollmentError(sku)
  
  const handleEnroll = () => {
    enroll(sku)
  }
  
  if (status === 'enrolling') {
    return <button disabled>Enrolling...</button>
  }
  
  if (status === 'success') {
    return <button disabled>Enrolled!</button>
  }
  
  return (
    <div>
      <button onClick={handleEnroll}>Enroll Now</button>
      {error && <p className="error">{error}</p>}
    </div>
  )
}
```

## 🎯 Package Mapping

The integration maps your Shikshanam packages to Graphy products:

```typescript
const PACKAGE_TO_GRAPHY_MAPPING = {
  'sanskrit-foundations': {
    sku: 'sanskrit-foundations',
    graphyProductId: 'sanskrit_foundations_001',
    graphyCourseIds: ['sanskrit_alphabet_001', 'sanskrit_grammar_001'],
    liveClassIds: ['sanskrit_live_001']
  },
  // ... more mappings
}
```

## 📊 Available Data

### Learner Data
- Profile information
- Course enrollment status
- Progress tracking
- Usage analytics
- Discussion participation

### Package Data
- Enrollment status
- Progress percentage
- Available mentor hours
- Certificate status
- Live session schedules

### Live Session Data
- Upcoming sessions
- Attendee lists
- Seat availability
- Session details

## 🔐 Authentication Flow

1. User logs in to Shikshanam
2. System automatically creates learner in Graphy
3. Graphy learner ID is stored in user context
4. All subsequent API calls use the learner ID

## 🛠 API Endpoints

### Learner Management
- `GET /api/graphy/learners/[learnerId]` - Get learner info
- `POST /api/graphy/learners/create` - Create/update learner
- `GET /api/graphy/learners/[learnerId]/usage` - Get usage stats

### Package Management
- `POST /api/graphy/packages/[sku]/enroll` - Enroll in package
- `GET /api/graphy/packages/[sku]/progress` - Get progress
- `GET /api/graphy/packages/[sku]/sessions` - Get live sessions

### Device Management
- `PUT /api/graphy/learners/reset-device` - Reset device registration
- `PATCH /api/graphy/learners/reset/ios/screenshot` - Reset iOS restrictions

## 🎨 UI Components

### GraphyPackageDetail
Enhanced package detail page with:
- Real-time enrollment status
- Progress tracking
- Live session integration
- Error handling

### GraphyUserDashboard
Complete user dashboard with:
- Package overview
- Progress visualization
- Live session management
- Device management tools

## 🔄 Data Flow

1. **User Authentication** → Creates Graphy learner
2. **Package Browsing** → Shows Graphy integration status
3. **Enrollment** → Enrolls in Graphy product
4. **Learning** → Tracks progress in Graphy
5. **Dashboard** → Displays Graphy data

## 🚨 Error Handling

The integration includes comprehensive error handling:
- API connection errors
- Authentication failures
- Enrollment conflicts
- Device management issues

## 📱 Device Management

Users can manage their devices through the dashboard:
- Reset device registrations
- Reset iOS screenshot restrictions
- View device usage

## 🔧 Configuration

### Environment Variables
```bash
GRAPHY_API_URL=https://api.ongraphy.com
GRAPHY_API_KEY=52bae682-186d-44af-a933-c6b6808596c9
GRAPHY_MID=hyperquest
```

### Package Mapping
Update `PACKAGE_TO_GRAPHY_MAPPING` in `graphy-package-integration.ts` to add new packages.

## 🧪 Testing

### Test the Integration
1. Start your development server
2. Navigate to `/dashboard` to see the user dashboard
3. Visit `/packages/[sku]/graphy` to see package integration
4. Test enrollment flow with a logged-in user

### API Testing
Use the provided API endpoints to test:
- Learner creation
- Package enrollment
- Progress tracking
- Live session management

## 🚀 Next Steps

1. **Add More Packages** - Update the mapping for additional packages
2. **Customize UI** - Modify components to match your design
3. **Add Analytics** - Integrate with your analytics platform
4. **Payment Integration** - Connect with your payment system
5. **Notifications** - Add real-time notifications for live sessions

## 📞 Support

For issues with the Graphy integration:
1. Check the browser console for errors
2. Verify environment variables are set correctly
3. Ensure Graphy API credentials are valid
4. Check network connectivity to Graphy APIs

The integration is now ready for production use! 🎉
