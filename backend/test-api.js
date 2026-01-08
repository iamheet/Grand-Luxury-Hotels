const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    console.log('🧪 Testing API endpoints...\n');

    // Test hotels endpoint
    console.log('1. Testing GET /api/hotels');
    const hotelsResponse = await axios.get(`${BASE_URL}/hotels`);
    console.log(`✅ Hotels: ${hotelsResponse.data.hotels?.length || 0} found`);

    // Test users endpoint
    console.log('\n2. Testing GET /api/users');
    const usersResponse = await axios.get(`${BASE_URL}/users`);
    console.log(`✅ Users: ${usersResponse.data.users?.length || 0} found`);

    // Test members endpoint
    console.log('\n3. Testing GET /api/members');
    const membersResponse = await axios.get(`${BASE_URL}/members`);
    console.log(`✅ Members: ${membersResponse.data.members?.length || 0} found`);

    // Test admin bookings endpoint
    console.log('\n4. Testing GET /api/bookings/admin/all');
    const bookingsResponse = await axios.get(`${BASE_URL}/bookings/admin/all`);
    console.log(`✅ Bookings: ${bookingsResponse.data.total || 0} found`);

    console.log('\n🎉 All API endpoints are working!');
    console.log('\n📊 Summary:');
    console.log(`Hotels: ${hotelsResponse.data.hotels?.length || 0}`);
    console.log(`Users: ${usersResponse.data.users?.length || 0}`);
    console.log(`Members: ${membersResponse.data.members?.length || 0}`);
    console.log(`Bookings: ${bookingsResponse.data.total || 0}`);

  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    console.log('\n💡 Make sure your server is running on port 5000');
  }
}

testAPI();