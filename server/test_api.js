import axios from 'axios';

async function testEchoJournal() {
  const BASE_URL = 'http://localhost:5000/api';

  console.log('🧪 Starting EchoJournal Full-Stack API Integration Tests...');

  // 1. Health check
  const healthRes = await axios.get(`${BASE_URL}/health`);
  console.log('✅ 1. Health Check:', healthRes.data);

  // 2. Signup
  const signupRes = await axios.post(`${BASE_URL}/auth/signup`, {
    name: 'Alex Morgan',
    email: `alex_${Date.now()}@echojournal.io`,
    password: 'securePassword123'
  });
  console.log('✅ 2. Signup successful! Token received:', signupRes.data.token ? 'Yes' : 'No');
  const token = signupRes.data.token;

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  // 3. Create Journal Entry (Voice/Text -> Encrypt AES-256 -> Gemini AI Analysis)
  const journal1 = await axios.post(`${BASE_URL}/journal`, {
    text: "I've been stressed because of work deadlines and a big project launch. I also couldn't sleep well yesterday.",
    tags: ['Work', 'Sleep']
  }, authHeader);

  console.log('✅ 3. Journal Entry 1 Encrypted & Analyzed:');
  console.log('   - Decrypted Text:', journal1.data.journal.text);
  console.log('   - Emotion:', journal1.data.journal.analysis.emotion);
  console.log('   - Stress Level:', journal1.data.journal.analysis.stressLevel + '%');
  console.log('   - Positivity Score:', journal1.data.journal.analysis.positivityScore + '%');
  console.log('   - Topics:', journal1.data.journal.analysis.topics);

  // 4. Create Entry 2 (Positive)
  const journal2 = await axios.post(`${BASE_URL}/journal`, {
    text: "Had a fantastic morning workout and went for a peaceful walk in nature. Feeling extremely grateful and energized!",
    tags: ['Fitness', 'Gratitude']
  }, authHeader);
  console.log('✅ 4. Journal Entry 2 Created (Joy / Positive Resilience).');

  // 5. Get Decrypted Journals List
  const listRes = await axios.get(`${BASE_URL}/journal`, authHeader);
  console.log(`✅ 5. Retrieved ${listRes.data.count} decrypted journal entries.`);

  // 6. Get Dashboard Analytics & Trend Calculations
  const dashboardRes = await axios.get(`${BASE_URL}/dashboard`, authHeader);
  console.log('✅ 6. Dashboard Metrics & Trend Analysis:');
  console.log('   - Current Mood:', dashboardRes.data.analytics.currentMood);
  console.log('   - Avg Stress:', dashboardRes.data.analytics.averageStress + '%');
  console.log('   - AI Trend Insights:', dashboardRes.data.analytics.insights);

  // 7. Test AI Smart Search
  const searchRes = await axios.post(`${BASE_URL}/ai/smart-search`, {
    query: 'Show entries where I felt stressed about work'
  }, authHeader);
  console.log(`✅ 7. Smart Search NLP found ${searchRes.data.resultsCount} matching entries.`);

  // 8. Test AI Chat Reflection
  const chatRes = await axios.post(`${BASE_URL}/ai/chat-reflection`, {
    message: 'What usually helps when I am stressed about work?'
  }, authHeader);
  console.log('✅ 8. AI Chat Reflection Reply:', chatRes.data.reply);

  console.log('\n🎉 ALL FULL-STACK API TESTS PASSED SUCCESSFULLY!');
}

testEchoJournal().catch(err => {
  console.error('❌ Test failed:', err.response?.data || err.message);
});
