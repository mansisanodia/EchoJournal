/**
 * EchoJournal - Demo Seed Script
 * Creates a demo user and 15 realistic journal entries spanning 30 days
 * Run: node seed_demo.js
 */
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const DEMO_EMAIL = 'demo@echojournal.io';
const DEMO_PASSWORD = 'demo1234';
const DEMO_NAME = 'Alex Morgan';

const DEMO_JOURNALS = [
  {
    text: "Had a terrible Monday. Work deadlines are piling up and I barely slept last night. My manager assigned two new projects without warning. Feeling extremely overwhelmed.",
    tags: ['Work', 'Sleep'],
    daysAgo: 30
  },
  {
    text: "Went to the gym today for the first time in weeks. Felt amazing afterwards! My energy is much better and I'm feeling hopeful about the week ahead.",
    tags: ['Fitness', 'Health'],
    daysAgo: 28
  },
  {
    text: "Had a great call with my family this evening. My mom cooked my favorite dish and we laughed a lot over video call. Feeling grateful and connected.",
    tags: ['Family', 'Gratitude'],
    daysAgo: 26
  },
  {
    text: "The work pressure continues. Missed two deadlines today. My boss wasn't happy. I'm starting to question if I'm cut out for this role. Anxiety is through the roof.",
    tags: ['Work', 'Personal Growth'],
    daysAgo: 24
  },
  {
    text: "Meditated for 20 minutes this morning. It helped calm me down significantly. Going to make this a daily habit. Feeling centered and more in control.",
    tags: ['Health', 'Personal Growth'],
    daysAgo: 22
  },
  {
    text: "Couldn't sleep again. Insomnia is getting worse. Kept thinking about the project launch. Got up at 3am and just stared at the ceiling for two hours. I'm exhausted.",
    tags: ['Sleep', 'Work'],
    daysAgo: 20
  },
  {
    text: "Finally presented the project and it went GREAT! The client loved it. My manager praised me in front of the whole team. Feeling so proud and relieved!",
    tags: ['Work', 'Gratitude'],
    daysAgo: 18
  },
  {
    text: "Went hiking in the mountains with my friend today. The fresh air and beautiful views completely reset my mood. Nature is healing. Feeling peaceful and alive.",
    tags: ['Health', 'Relationships'],
    daysAgo: 16
  },
  {
    text: "Had a difficult conversation with a close friend. We cleared up some misunderstandings. It was emotionally draining but I feel lighter now. Relationships take work.",
    tags: ['Relationships', 'Personal Growth'],
    daysAgo: 14
  },
  {
    text: "Feeling burnt out. Work is relentless. I have no time for myself. My sleep is suffering. I need a vacation but there's no break in sight. Stress is at an all time high.",
    tags: ['Work', 'Sleep', 'Health'],
    daysAgo: 12
  },
  {
    text: "Started a new book about mindfulness. The first chapter already resonated deeply. Going to try the breathing exercises before sleep tonight. Hopeful for improvement.",
    tags: ['Personal Growth', 'Health'],
    daysAgo: 10
  },
  {
    text: "Had the best sleep I've had in weeks! The breathing technique from the book actually worked. Woke up feeling refreshed and energized. Today feels like a new beginning.",
    tags: ['Sleep', 'Health'],
    daysAgo: 8
  },
  {
    text: "Celebrated my friend's promotion at a dinner party. Laughed so much my stomach hurts. Moments like these remind me why friendships matter so much. Pure joy.",
    tags: ['Relationships', 'Gratitude'],
    daysAgo: 6
  },
  {
    text: "Work meeting was tough. More deadlines added. But I feel stronger than I did last month. I'm handling the pressure better. Growth is happening, even if slowly.",
    tags: ['Work', 'Personal Growth'],
    daysAgo: 3
  },
  {
    text: "Woke up feeling genuinely happy today. No particular reason. Just grateful for my health, my friends, and the life I'm building. Positivity is a choice I'm making daily.",
    tags: ['Gratitude', 'Personal Growth'],
    daysAgo: 1
  }
];

async function seedDemo() {
  console.log('🌱 Starting EchoJournal Demo Seed...');
  console.log(`URL: ${BASE_URL}`);

  // Try login first, then signup
  let token;
  try {
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD
    });
    token = loginRes.data.token;
    console.log('✅ Logged in as existing demo user.');
  } catch {
    const signupRes = await axios.post(`${BASE_URL}/auth/signup`, {
      name: DEMO_NAME,
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD
    });
    token = signupRes.data.token;
    console.log('✅ Created new demo user:', DEMO_NAME, '/', DEMO_EMAIL);
  }

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  // Check if demo data already exists
  const listRes = await axios.get(`${BASE_URL}/journal`, authHeader);
  if (listRes.data.count >= 10) {
    console.log(`ℹ️ Demo data already seeded (${listRes.data.count} entries found). Skipping.`);
    return;
  }

  console.log('\n📝 Creating demo journal entries...');

  for (let i = 0; i < DEMO_JOURNALS.length; i++) {
    const entry = DEMO_JOURNALS[i];
    await axios.post(`${BASE_URL}/journal`, {
      text: entry.text,
      tags: entry.tags
    }, authHeader);
    console.log(`   ✅ Entry ${i + 1}/15: "${entry.text.substring(0, 60)}..."`);
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  // Final dashboard check
  const dashRes = await axios.get(`${BASE_URL}/dashboard`, authHeader);
  const { analytics } = dashRes.data;

  console.log('\n📊 Demo Dashboard Summary:');
  console.log(`   Total Entries: ${analytics.totalEntries}`);
  console.log(`   Current Mood: ${analytics.currentMood}`);
  console.log(`   Avg Stress: ${analytics.averageStress}%`);
  console.log(`   Avg Positivity: ${analytics.averagePositivity}%`);
  console.log(`   Top Topic: ${analytics.mostMentionedTopic}`);
  console.log(`   AI Insights: ${analytics.insights.length} insights generated`);
  console.log(`   Emotion Distribution: ${analytics.emotionDistribution.map(e => e.name).join(', ')}`);

  console.log('\n🎉 DEMO SEED COMPLETE!');
  console.log(`\n🔗 Login at http://localhost:3000/login`);
  console.log(`   Email:    ${DEMO_EMAIL}`);
  console.log(`   Password: ${DEMO_PASSWORD}`);
}

seedDemo().catch(err => {
  console.error('❌ Seed failed:', err.response?.data || err.message);
});
