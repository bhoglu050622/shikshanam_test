# Graphy API Integration Documentation

## Overview
This document provides complete integration details for the Graphy REST API, including authentication credentials, endpoint specifications, and implementation examples for the Shikshanam platform.

## Authentication Credentials

### Production Credentials
```
Merchant ID (MID): hyperquest
API Token: 52bae682-186d-44af-a933-c6b6808596c9
```

### Environment Variables
Add these to your `.env.local` file:
```bash
GRAPHY_API_URL=https://api.ongraphy.com
GRAPHY_API_KEY=52bae682-186d-44af-a933-c6b6808596c9
GRAPHY_MID=hyperquest
```

## Base URLs
- **v1 API**: `https://api.ongraphy.com/public/v1/`
- **v3 API**: `https://api.ongraphy.com/t/api/public/v3/`

## API Endpoints

### v1 Endpoints

#### 1. Get Learner by ID
**Purpose**: Retrieve learner information and optionally course progress data.

**Method**: `GET`

**Endpoint**: `/public/v1/learners/:learnerId`

**URL Structure**:
```
https://api.ongraphy.com/public/v1/learners/{learnerId}?mid={merchantId}&key={apiKey}&courseInfo={boolean}
```

**Path Parameters**:
- `learnerId` (Required): The unique identifier of the learner

**Query Parameters**:
- `mid` (Required): Merchant ID - `hyperquest`
- `key` (Required): API Key - `52bae682-186d-44af-a933-c6b6808596c9`
- `courseInfo` (Optional): Boolean flag to include course progress/enrollment information

**Example Request**:
```javascript
const response = await fetch(
  `https://api.ongraphy.com/public/v1/learners/12345?mid=hyperquest&key=52bae682-186d-44af-a933-c6b6808596c9&courseInfo=true`
);
const learnerData = await response.json();
```

**Response**: Learner profile data with optional course information

---

#### 2. Get Learner Usage
**Purpose**: Retrieve learner's usage statistics for a specific product.

**Method**: `GET`

**Endpoint**: `/public/v1/learners/:learnerId/usage`

**URL Structure**:
```
https://api.ongraphy.com/public/v1/learners/{learnerId}/usage?mid={merchantId}&key={apiKey}&productId={productId}&date={date}
```

**Path Parameters**:
- `learnerId` (Required): The unique identifier of the learner

**Query Parameters**:
- `mid` (Required): Merchant ID - `hyperquest`
- `key` (Required): API Key - `52bae682-186d-44af-a933-c6b6808596c9`
- `productId` (Required): The ID of the product/course
- `date` (Optional): Date in YYYY/MM/DD format

**Example Request**:
```javascript
const response = await fetch(
  `https://api.ongraphy.com/public/v1/learners/12345/usage?mid=hyperquest&key=52bae682-186d-44af-a933-c6b6808596c9&productId=67890&date=2024/01/15`
);
const usageData = await response.json();
```

**Response**: Usage statistics and analytics data

---

#### 3. Get Learner Discussions
**Purpose**: Retrieve learner's discussion posts and interactions.

**Method**: `GET`

**Endpoint**: `/public/v1/learners/:learnerId/discussions`

**URL Structure**:
```
https://api.ongraphy.com/public/v1/learners/{learnerId}/discussions?mid={merchantId}&key={apiKey}&startDate={startDate}&endDate={endDate}
```

**Path Parameters**:
- `learnerId` (Required): The unique identifier of the learner

**Query Parameters**:
- `mid` (Required): Merchant ID - `hyperquest`
- `key` (Required): API Key - `52bae682-186d-44af-a933-c6b6808596c9`
- `startDate` (Optional): Start date in YYYY/MM/DD format
- `endDate` (Optional): End date in YYYY/MM/DD format

**Example Request**:
```javascript
const response = await fetch(
  `https://api.ongraphy.com/public/v1/learners/12345/discussions?mid=hyperquest&key=52bae682-186d-44af-a933-c6b6808596c9&startDate=2024/01/01&endDate=2024/01/31`
);
const discussionsData = await response.json();
```

**Response**: Discussion posts and interaction data

---

### v3 Endpoints

#### 4. Get Live Class Attendees
**Purpose**: Retrieve list of attendees for a specific live class.

**Method**: `GET`

**Endpoint**: `/t/api/public/v3/products/liveclass/attendees`

**URL Structure**:
```
https://api.ongraphy.com/t/api/public/v3/products/liveclass/attendees?mid={merchantId}&key={apiKey}&skip={skip}&limit={limit}&liveClassId={liveClassId}
```

**Query Parameters**:
- `mid` (Required): Merchant ID - `hyperquest`
- `key` (Required): API Key - `52bae682-186d-44af-a933-c6b6808596c9`
- `skip` (Optional): Page number, default: 0
- `limit` (Optional): Results per page, default: 10, max: 100
- `liveClassId` (Required): The ID of the live class

**Example Request**:
```javascript
const response = await fetch(
  `https://api.ongraphy.com/t/api/public/v3/products/liveclass/attendees?mid=hyperquest&key=52bae682-186d-44af-a933-c6b6808596c9&skip=0&limit=50&liveClassId=live123`
);
const attendeesData = await response.json();
```

**Response**: List of live class attendees with pagination

---

#### 5. Reset Learner Device(s)
**Purpose**: Reset device registrations for a learner (useful for troubleshooting device limits).

**Method**: `PUT`

**Endpoint**: `/t/api/public/v3/learners/reset-device`

**URL Structure**:
```
https://api.ongraphy.com/t/api/public/v3/learners/reset-device?mid={merchantId}&key={apiKey}&email={email}
```

**Query Parameters**:
- `mid` (Required): Merchant ID - `hyperquest`
- `key` (Required): API Key - `52bae682-186d-44af-a933-c6b6808596c9`
- `email` (Required): User's email address

**Example Request**:
```javascript
const response = await fetch(
  `https://api.ongraphy.com/t/api/public/v3/learners/reset-device?mid=hyperquest&key=52bae682-186d-44af-a933-c6b6808596c9&email=user@example.com`,
  { method: 'PUT' }
);
const resetResult = await response.json();
```

**Response**: Confirmation of device reset

---

#### 6. Create/Update Learner
**Purpose**: Create a new learner or update existing learner information.

**Method**: `PATCH`

**Endpoint**: `/t/api/public/v3/learners/update`

**Headers**:
```
Content-Type: application/x-www-form-urlencoded
```

**Body Parameters** (form-encoded):
- `mid` (Required): Merchant ID - `hyperquest`
- `key` (Required): API Key - `52bae682-186d-44af-a933-c6b6808596c9`
- `email` (Required): Primary email address
- `name` (Optional): Learner's name
- `password` (Optional): Password (random if not provided)
- `mobile` (Optional): Mobile number with country code (e.g., +91...)
- `sendEmail` (Optional): Boolean, default: true
- `customFields` (Optional): JSON object with custom data

**Example Request**:
```javascript
const formData = new URLSearchParams();
formData.append('mid', 'hyperquest');
formData.append('key', '52bae682-186d-44af-a933-c6b6808596c9');
formData.append('email', 'newuser@example.com');
formData.append('name', 'John Doe');
formData.append('mobile', '+919876543210');
formData.append('sendEmail', 'true');
formData.append('customFields', JSON.stringify({ source: 'shikshanam' }));

const response = await fetch(
  'https://api.ongraphy.com/t/api/public/v3/learners/update',
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData
  }
);
const learnerResult = await response.json();
```

**Response**: Learner creation/update confirmation

---

#### 7. Reset iOS Screenshot Restriction
**Purpose**: Reset iOS screenshot restrictions for a specific learner.

**Method**: `PATCH`

**Endpoint**: `/t/api/public/v3/learners/reset/ios/screenshot`

**URL Structure**:
```
https://api.ongraphy.com/t/api/public/v3/learners/reset/ios/screenshot?mid={merchantId}&key={apiKey}&email={email}
```

**Query Parameters**:
- `mid` (Required): Merchant ID - `hyperquest`
- `key` (Required): API Key - `52bae682-186d-44af-a933-c6b6808596c9`
- `email` (Required): User's email address

**Example Request**:
```javascript
const response = await fetch(
  `https://api.ongraphy.com/t/api/public/v3/learners/reset/ios/screenshot?mid=hyperquest&key=52bae682-186d-44af-a933-c6b6808596c9&email=user@example.com`,
  { method: 'PATCH' }
);
const resetResult = await response.json();
```

**Response**: Confirmation of screenshot restriction reset

---

## Implementation Examples

### TypeScript/JavaScript Service Class

```typescript
class GraphyAPIService {
  private baseUrl = 'https://api.ongraphy.com';
  private mid = 'hyperquest';
  private apiKey = '52bae682-186d-44af-a933-c6b6808596c9';

  async getLearner(learnerId: string, includeCourseInfo = false) {
    const url = `${this.baseUrl}/public/v1/learners/${learnerId}?mid=${this.mid}&key=${this.apiKey}&courseInfo=${includeCourseInfo}`;
    const response = await fetch(url);
    return response.json();
  }

  async getLearnerUsage(learnerId: string, productId: string, date?: string) {
    const dateParam = date ? `&date=${date}` : '';
    const url = `${this.baseUrl}/public/v1/learners/${learnerId}/usage?mid=${this.mid}&key=${this.apiKey}&productId=${productId}${dateParam}`;
    const response = await fetch(url);
    return response.json();
  }

  async getLearnerDiscussions(learnerId: string, startDate?: string, endDate?: string) {
    const startParam = startDate ? `&startDate=${startDate}` : '';
    const endParam = endDate ? `&endDate=${endDate}` : '';
    const url = `${this.baseUrl}/public/v1/learners/${learnerId}/discussions?mid=${this.mid}&key=${this.apiKey}${startParam}${endParam}`;
    const response = await fetch(url);
    return response.json();
  }

  async getLiveClassAttendees(liveClassId: string, skip = 0, limit = 10) {
    const url = `${this.baseUrl}/t/api/public/v3/products/liveclass/attendees?mid=${this.mid}&key=${this.apiKey}&skip=${skip}&limit=${limit}&liveClassId=${liveClassId}`;
    const response = await fetch(url);
    return response.json();
  }

  async resetLearnerDevice(email: string) {
    const url = `${this.baseUrl}/t/api/public/v3/learners/reset-device?mid=${this.mid}&key=${this.apiKey}&email=${email}`;
    const response = await fetch(url, { method: 'PUT' });
    return response.json();
  }

  async createOrUpdateLearner(learnerData: {
    email: string;
    name?: string;
    password?: string;
    mobile?: string;
    sendEmail?: boolean;
    customFields?: object;
  }) {
    const formData = new URLSearchParams();
    formData.append('mid', this.mid);
    formData.append('key', this.apiKey);
    formData.append('email', learnerData.email);
    
    if (learnerData.name) formData.append('name', learnerData.name);
    if (learnerData.password) formData.append('password', learnerData.password);
    if (learnerData.mobile) formData.append('mobile', learnerData.mobile);
    if (learnerData.sendEmail !== undefined) formData.append('sendEmail', learnerData.sendEmail.toString());
    if (learnerData.customFields) formData.append('customFields', JSON.stringify(learnerData.customFields));

    const response = await fetch(`${this.baseUrl}/t/api/public/v3/learners/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });
    return response.json();
  }

  async resetIOSScreenshotRestriction(email: string) {
    const url = `${this.baseUrl}/t/api/public/v3/learners/reset/ios/screenshot?mid=${this.mid}&key=${this.apiKey}&email=${email}`;
    const response = await fetch(url, { method: 'PATCH' });
    return response.json();
  }
}

export default GraphyAPIService;
```

### Next.js API Route Example

```typescript
// app/api/graphy/learners/[learnerId]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const GRAPHY_CONFIG = {
  baseUrl: 'https://api.ongraphy.com',
  mid: 'hyperquest',
  apiKey: '52bae682-186d-44af-a933-c6b6808596c9'
};

export async function GET(
  request: NextRequest,
  { params }: { params: { learnerId: string } }
) {
  try {
    const { learnerId } = params;
    const { searchParams } = new URL(request.url);
    const includeCourseInfo = searchParams.get('courseInfo') === 'true';

    const url = `${GRAPHY_CONFIG.baseUrl}/public/v1/learners/${learnerId}?mid=${GRAPHY_CONFIG.mid}&key=${GRAPHY_CONFIG.apiKey}&courseInfo=${includeCourseInfo}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch learner data' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Graphy API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## Error Handling

### Common HTTP Status Codes
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized (invalid API key or MID)
- `404`: Not Found (learner/product not found)
- `500`: Internal Server Error

### Error Response Format
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
```

## Rate Limits
- No specific rate limits mentioned in documentation
- Implement reasonable delays between requests
- Consider implementing exponential backoff for retries

## Security Notes
1. **Never expose API credentials in client-side code**
2. **Use environment variables for all credentials**
3. **Implement proper error handling to avoid exposing sensitive information**
4. **Validate all input parameters before making API calls**
5. **Use HTTPS for all API communications**

## Testing
Use the provided credentials to test all endpoints in a development environment before deploying to production.

## Support
For additional API documentation or support, contact Graphy support team or refer to their official documentation portal.
