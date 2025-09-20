const Database = require("better-sqlite3");
const { join } = require("path");
const crypto = require("crypto");

const db = new Database(join(process.cwd(), "traffic_events.db"));

// Initialize database tables
function initDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Traffic events table
  db.exec(`
    CREATE TABLE IF NOT EXISTS traffic_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      video_url TEXT NOT NULL,
      license_plate_image_url TEXT NOT NULL,
      event_type TEXT NOT NULL,
      location TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_processed BOOLEAN DEFAULT FALSE
    )
  `);

  // Annotations table (for tracking completed annotations)
  db.exec(`
    CREATE TABLE IF NOT EXISTS annotations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      license_plate_number TEXT,
      decision TEXT NOT NULL,
      issue_reason TEXT,
      dmv_make TEXT,
      dmv_model TEXT,
      dmv_color TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES traffic_events (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);
}

// Seed data
async function seedDatabase() {
  // Check if data already exists
  const existingEvents = db
    .prepare("SELECT COUNT(*) as count FROM traffic_events")
    .get();

  if (existingEvents.count > 0) {
    return; // Data already seeded
  }

  // Sample traffic events
  const events = [
    {
      video_url: "https://www.youtube.com/watch?v=PiOqMMOFQNw",
      license_plate_image_url:
        "https://upload.wikimedia.org/wikipedia/commons/3/3f/Pakistan_-_License_Plate_-_Punjab.png",
      event_type: "stop_sign_violation",
      location: "Main Street & Oak Avenue",
    },
    {
      video_url: "https://www.youtube.com/watch?v=zRBb1H4eo_U",
      license_plate_image_url:
        "https://upload.wikimedia.org/wikipedia/commons/a/af/Pakistan_-_License_Plate_-_Sindh.png",
      event_type: "red_light_violation",
      location: "First Street & Pine Road",
    },
    {
      video_url: "https://www.youtube.com/watch?v=Wl59V9DvT3s",
      license_plate_image_url:
        "https://hpr.com/wp-content/uploads/2023/08/LP_USA_California_passenger.jpg",
      event_type: "speeding",
      location: "Highway 101 Mile 45",
    },
    {
      video_url: "https://www.youtube.com/watch?v=7RC_7FvP1Ck",
      license_plate_image_url:
        "https://i.etsystatic.com/16787675/r/il/36fd7b/4020111489/il_570xN.4020111489_8bq0.jpg",
      event_type: "stop_sign_violation",
      location: "Cedar Street & Maple Drive",
    },
    {
      video_url:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      license_plate_image_url:
        "https://i.etsystatic.com/16787675/r/il/6d003a/4019873185/il_570xN.4019873185_3e2p.jpg",
      event_type: "red_light_violation",
      location: "Second Avenue & Elm Street",
    },
    {
      video_url:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      license_plate_image_url:
        "https://signsandtagsonline.com/cdn/shop/products/california-custom-SESQUICENTENNIAL-150-YEARS-plate.jpg?v=1576010878&width=1445",
      event_type: "speeding",
      location: "Park Boulevard & Valley Road",
    },
    {
      video_url:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      license_plate_image_url:
        "https://m.media-amazon.com/images/I/71OfEQXMn-L.jpg",
      event_type: "stop_sign_violation",
      location: "Riverside Drive & Bridge Street",
    },
    {
      video_url:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      license_plate_image_url:
        "https://i.etsystatic.com/16787675/r/il/86d3b2/3962681964/il_570xN.3962681964_2sz9.jpg",
      event_type: "red_light_violation",
      location: "Downtown Plaza & Commerce Street",
    },
    {
      video_url:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      license_plate_image_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPCV_6gKOHMf6K6LMphSbVTmj7OfT2_n674_-4wnapAdN-iMvyGVg3OR7Pm9iVt_tkkUM&usqp=CAU",
      event_type: "speeding",
      location: "Industrial Parkway & Factory Road",
    },
    {
      video_url:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      license_plate_image_url:
        "https://1800lionlaw.com/wp-content/uploads/2023/09/Texas-license-plate-scaled.jpeg",
      event_type: "stop_sign_violation",
      location: "School Street & Campus Drive",
    },
  ];

  const insertEvent = db.prepare(`
    INSERT INTO traffic_events (video_url, license_plate_image_url, event_type, location)
    VALUES (?, ?, ?, ?)
  `);

  events.forEach((event) => {
    insertEvent.run(
      event.video_url,
      event.license_plate_image_url,
      event.event_type,
      event.location
    );
  });

  // Create a demo user - using a simple hash for demo purposes
  const hashedPassword = crypto
    .createHash("sha256")
    .update("demo123")
    .digest("hex");

  const insertUser = db.prepare(`
    INSERT INTO users (email, password, name)
    VALUES (?, ?, ?)
  `);

  insertUser.run("demo@traffic.com", hashedPassword, "Demo Annotator");
}

module.exports = { initDatabase, seedDatabase, default: db };
