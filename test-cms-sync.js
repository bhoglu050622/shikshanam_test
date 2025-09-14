// Test script to verify CMS content synchronization
const https = require('https');

const CMS_URL = 'https://cms-admin-8ecb3k2p2-amanamns-projects.vercel.app';
const MAIN_URL = 'https://shikshanam-89u5jyn7s-amanamns-projects.vercel.app';

// Test content update
const testContent = {
  filePath: 'components/sections/Hero.tsx',
  content: `main title: Welcome to Shikshan
subtitle: Where AI meets Ancient India
question: What do you seek?
button text: Start Journey`,
  message: 'Test content sync - Updated via script'
};

// Function to make HTTPS request
function makeRequest(url, options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test CMS API
async function testCMSAPI() {
  console.log('🧪 Testing CMS API...');
  
  try {
    // Test GET request
    console.log('📥 Testing GET request...');
    const getResponse = await makeRequest(`${CMS_URL}/api/content-secure?filePath=${encodeURIComponent(testContent.filePath)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CMS-Test-Script/1.0'
      }
    });
    
    console.log('GET Response:', getResponse.status, getResponse.data);
    
    // Test POST request (this will likely fail due to authentication, but we can see the response)
    console.log('📤 Testing POST request...');
    const postResponse = await makeRequest(`${CMS_URL}/api/content-secure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'CMS-Test-Script/1.0'
      }
    }, testContent);
    
    console.log('POST Response:', postResponse.status, postResponse.data);
    
  } catch (error) {
    console.error('❌ CMS API Test Error:', error.message);
  }
}

// Test main website
async function testMainWebsite() {
  console.log('🌐 Testing Main Website...');
  
  try {
    const response = await makeRequest(MAIN_URL, {
      method: 'GET',
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'CMS-Test-Script/1.0'
      }
    });
    
    console.log('Main Website Response:', response.status);
    
    // Check if the response contains our test content
    if (response.data.includes('Welcome to Shikshan')) {
      console.log('✅ Content sync working! Found "Welcome to Shikshan" on main website');
    } else if (response.data.includes('Welcome to Ancient Wisdom')) {
      console.log('ℹ️  Using default content: "Welcome to Ancient Wisdom"');
    } else {
      console.log('❓ Unknown content found on main website');
    }
    
  } catch (error) {
    console.error('❌ Main Website Test Error:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting CMS Content Sync Tests...\n');
  
  await testCMSAPI();
  console.log('');
  await testMainWebsite();
  
  console.log('\n✅ Tests completed!');
  console.log('\n📋 Summary:');
  console.log('- CMS Admin URL:', CMS_URL);
  console.log('- Main Website URL:', MAIN_URL);
  console.log('- Test Content:', testContent.content.split('\n')[0]);
}

runTests().catch(console.error);
