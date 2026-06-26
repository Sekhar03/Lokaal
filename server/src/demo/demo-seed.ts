import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';

function seedDemoData(db: Database.Database): { adminId: number; demoId: number } {
  const ADMIN_USER = process.env.DEMO_ADMIN_USER || 'admin';
  const ADMIN_EMAIL = process.env.DEMO_ADMIN_EMAIL || 'admin@trek.app';
  const ADMIN_PASS = process.env.DEMO_ADMIN_PASS || 'admin12345';
  const DEMO_EMAIL = 'demo@trek.app';
  const DEMO_PASS = 'demo12345';

  // Create admin user if not exists
  let admin = db.prepare('SELECT id FROM users WHERE email = ?').get(ADMIN_EMAIL) as { id: number } | undefined;
  if (!admin) {
    const hash = bcrypt.hashSync(ADMIN_PASS, 10);
    const r = db.prepare('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)').run(ADMIN_USER, ADMIN_EMAIL, hash, 'admin');
    admin = { id: Number(r.lastInsertRowid) };
    console.log('[Demo] Admin user created');
  } else {
    admin.id = Number(admin.id);
  }

  // Create demo user if not exists
  let demo = db.prepare('SELECT id FROM users WHERE email = ?').get(DEMO_EMAIL) as { id: number } | undefined;
  if (!demo) {
    const hash = bcrypt.hashSync(DEMO_PASS, 10);
    const r = db.prepare('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)').run('demo', DEMO_EMAIL, hash, 'user');
    demo = { id: Number(r.lastInsertRowid) };
    console.log('[Demo] Demo user created');
  } else {
    demo.id = Number(demo.id);
  }

  // Disable registration in demo mode
  db.prepare("INSERT OR REPLACE INTO app_settings (key, value) VALUES ('allow_registration', 'false')").run();

  // Check if admin already has example trips
  const adminTrips = db.prepare('SELECT COUNT(*) as count FROM trips WHERE user_id = ?').get(admin.id) as { count: number };
  if (adminTrips.count > 0) {
    console.log('[Demo] Example trips already exist, ensuring demo membership');
    ensureDemoMembership(db, admin.id, demo.id);
    return { adminId: admin.id, demoId: demo.id };
  }

  console.log('[Demo] Seeding example trips...');
  seedExampleTrips(db, admin.id, demo.id);

  // Auto-save baseline after first seed
  const { saveBaseline, hasBaseline } = require('./demo-reset');
  if (!hasBaseline()) {
    saveBaseline();
  }

  return { adminId: admin.id, demoId: demo.id };
}

function ensureDemoMembership(db: Database.Database, adminId: number, demoId: number): void {
  const trips = db.prepare('SELECT id FROM trips WHERE user_id = ?').all(adminId) as { id: number }[];
  const insertMember = db.prepare('INSERT OR IGNORE INTO trip_members (trip_id, user_id, invited_by) VALUES (?, ?, ?)');
  for (const trip of trips) {
    insertMember.run(trip.id, demoId, adminId);
  }
}

function seedExampleTrips(db: Database.Database, adminId: number, demoId: number): void {
  const insertTrip = db.prepare('INSERT INTO trips (user_id, title, description, start_date, end_date, currency) VALUES (?, ?, ?, ?, ?, ?)');
  const insertDay = db.prepare('INSERT INTO days (trip_id, day_number, date) VALUES (?, ?, ?)');
  const insertPlace = db.prepare('INSERT INTO places (trip_id, name, lat, lng, address, category_id, place_time, duration_minutes, notes, image_url, google_place_id, website, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const insertAssignment = db.prepare('INSERT INTO day_assignments (day_id, place_id, order_index) VALUES (?, ?, ?)');
  const insertPacking = db.prepare('INSERT INTO packing_items (trip_id, name, checked, category, sort_order) VALUES (?, ?, ?, ?, ?)');
  const insertBudget = db.prepare('INSERT INTO budget_items (trip_id, category, name, total_price, persons, note) VALUES (?, ?, ?, ?, ?, ?)');
  const insertReservation = db.prepare('INSERT INTO reservations (trip_id, day_id, title, reservation_time, confirmation_number, status, type, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const insertMember = db.prepare('INSERT OR IGNORE INTO trip_members (trip_id, user_id, invited_by) VALUES (?, ?, ?)');
  const insertNote = db.prepare('INSERT INTO day_notes (day_id, trip_id, text, time, icon, sort_order) VALUES (?, ?, ?, ?, ?, ?)');

  // Category IDs: 1=Hotel, 2=Restaurant, 3=Attraction, 5=Transport, 7=Bar/Cafe, 8=Beach, 9=Nature, 6=Entertainment

  // --- Trip 1: Golden Triangle ---
  const trip1 = insertTrip.run(adminId, 'Golden Triangle India', 'Exploring Delhi, Agra, and Jaipur.', '2026-10-15', '2026-10-21', 'INR');
  const t1 = Number(trip1.lastInsertRowid);

  const t1days: number[] = [];
  for (let i = 0; i < 7; i++) {
    const d = insertDay.run(t1, i + 1, `2026-10-${15 + i}`);
    t1days.push(Number(d.lastInsertRowid));
  }

  const t1places: [number, string, number, number, string, number, string, number, string, string | null, string | null, string | null, string | null][] = [
    [t1, 'The Taj Mahal Palace Hotel (Delhi)', 28.6053, 77.2250, 'Mansingh Road, New Delhi, 110011, India', 1, '15:00', 60, 'Check-in from 3 PM.', null, null, null, '+91 11 2302 6162'],
    [t1, 'India Gate', 28.6129, 77.2295, 'Kartavya Path, India Gate, New Delhi, 110001', 3, '18:00', 45, 'Iconic war memorial.', null, null, null, null],
    [t1, 'Taj Mahal', 27.1751, 78.0421, 'Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001, India', 3, '06:00', 180, 'Sunrise visit to beat the crowds.', null, null, null, null],
    [t1, 'Agra Fort', 27.1795, 78.0211, 'Agra Fort, Rakabganj, Agra, Uttar Pradesh 282003', 3, '11:00', 120, 'Historic fort with views of the Taj.', null, null, null, null],
    [t1, 'Hawa Mahal', 26.9239, 75.8267, 'Hawa Mahal Rd, Badi Choupad, J.D.A. Market, Pink City, Jaipur, Rajasthan 302002', 3, '10:00', 75, 'Palace of Winds.', null, null, null, null],
    [t1, 'Amber Palace', 26.9855, 75.8513, 'Devisinghpura, Amer, Jaipur, Rajasthan 302028', 3, '14:00', 180, 'Majestic hilltop fort.', null, null, null, null],
  ];

  const t1pIds = t1places.map(p => Number(insertPlace.run(...p).lastInsertRowid));

  insertAssignment.run(t1days[0], t1pIds[0], 0);
  insertAssignment.run(t1days[0], t1pIds[1], 1);
  insertAssignment.run(t1days[1], t1pIds[2], 0);
  insertAssignment.run(t1days[1], t1pIds[3], 1);
  insertAssignment.run(t1days[2], t1pIds[4], 0);
  insertAssignment.run(t1days[2], t1pIds[5], 1);

  // Packing
  const t1packing: [string, number, string, number][] = [
    ['Passport', 1, 'Documents', 0], ['Power adapter Type D', 0, 'Electronics', 1],
    ['Comfortable walking shoes', 0, 'Clothing', 2], ['Sunscreen', 0, 'Toiletries', 3],
  ];
  t1packing.forEach(p => insertPacking.run(t1, ...p));

  // Budget
  insertBudget.run(t1, 'Accommodation', 'Hotels (6 nights)', 45000, 2, 'Luxury stays');
  insertBudget.run(t1, 'Transport', 'Flights & Cabs', 18000, 2, 'Local travel');

  insertReservation.run(t1, t1days[0], 'Hotel Check-in', '15:00', 'IND-2026-78432', 'confirmed', 'hotel', 'New Delhi');
  insertMember.run(t1, demoId, adminId);

  // --- Trip 2: Kerala Backwaters ---
  const trip2 = insertTrip.run(adminId, 'Kerala Backwaters', 'Relaxing trip to God\'s Own Country.', '2026-11-10', '2026-11-13', 'INR');
  const t2 = Number(trip2.lastInsertRowid);
  const t2days: number[] = [];
  for (let i = 0; i < 4; i++) { t2days.push(Number(insertDay.run(t2, i + 1, `2026-11-${10 + i}`).lastInsertRowid)); }

  const t2places: [number, string, number, number, string, number, string, number, string, string | null, string | null, string | null, string | null][] = [
    [t2, 'Alleppey Houseboat', 9.4981, 76.3388, 'Alappuzha, Kerala, India', 1, '14:00', 1440, 'Overnight stay in a houseboat.', null, null, null, null],
    [t2, 'Munnar Tea Gardens', 10.0889, 77.0595, 'Munnar, Kerala, India', 9, '10:00', 120, 'Lush green tea plantations.', null, null, null, null],
    [t2, 'Fort Kochi', 9.9633, 76.2383, 'Fort Kochi, Kochi, Kerala, India', 3, '16:00', 120, 'Chinese fishing nets at sunset.', null, null, null, null],
  ];
  const t2pIds = t2places.map(p => Number(insertPlace.run(...p).lastInsertRowid));

  insertAssignment.run(t2days[0], t2pIds[2], 0);
  insertAssignment.run(t2days[1], t2pIds[0], 0);
  insertAssignment.run(t2days[2], t2pIds[1], 0);

  insertMember.run(t2, demoId, adminId);

  // --- Trip 3: Goa Getaway ---
  const trip3 = insertTrip.run(adminId, 'Goa Getaway', 'Sun, sand, and seafood.', '2026-12-05', '2026-12-08', 'INR');
  const t3 = Number(trip3.lastInsertRowid);
  const t3days: number[] = [];
  for (let i = 0; i < 4; i++) { t3days.push(Number(insertDay.run(t3, i + 1, `2026-12-0${5 + i}`).lastInsertRowid)); }

  const t3places: [number, string, number, number, string, number, string, number, string, string | null, string | null, string | null, string | null][] = [
    [t3, 'Baga Beach', 15.5553, 73.7517, 'Baga, Goa, India', 8, '11:00', 180, 'Relax at the beach shacks.', null, null, null, null],
    [t3, 'Basilica of Bom Jesus', 15.5009, 73.9116, 'Old Goa Road, Bainguinim, Goa 403402, India', 3, '10:00', 90, 'UNESCO World Heritage site.', null, null, null, null],
  ];
  const t3pIds = t3places.map(p => Number(insertPlace.run(...p).lastInsertRowid));

  insertAssignment.run(t3days[0], t3pIds[0], 0);
  insertAssignment.run(t3days[1], t3pIds[1], 0);
  
  insertMember.run(t3, demoId, adminId);

  console.log('[Demo] 3 Indian example trips seeded and shared with demo user');
}

export { seedDemoData };
