import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import crypto from "crypto";

interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  created_at: string;
}

interface TrafficEvent {
  id: number;
  video_url: string;
  license_plate_image_url: string;
  event_type: string;
  location: string;
  timestamp: string;
  is_processed: boolean;
}

interface Annotation {
  id: number;
  event_id: number;
  user_id: number;
  license_plate_number?: string;
  decision: string;
  issue_reason?: string;
  dmv_make?: string;
  dmv_model?: string;
  dmv_color?: string;
  created_at: string;
}

interface Database {
  users: User[];
  traffic_events: TrafficEvent[];
  annotations: Annotation[];
}

const DB_FILE = join(process.cwd(), "traffic_events.json");

let db: Database;

function loadDatabase(): Database {
  if (existsSync(DB_FILE)) {
    const data = readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  }
  return {
    users: [],
    traffic_events: [],
    annotations: [],
  };
}

function saveDatabase() {
  writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// Initialize database
export function initDatabase() {
  db = loadDatabase();

  // Create demo user if it doesn't exist
  const existingUser = db.users.find((u) => u.email === "demo@traffic.com");
  if (!existingUser) {
    const hashedPassword = crypto
      .createHash("sha256")
      .update("demo123")
      .digest("hex");

    db.users.push({
      id: 1,
      email: "demo@traffic.com",
      password: hashedPassword,
      name: "Demo Annotator",
      created_at: new Date().toISOString(),
    });
  }

  // Create sample traffic events if they don't exist
  if (db.traffic_events.length === 0) {
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

    events.forEach((event, index) => {
      db.traffic_events.push({
        id: index + 1,
        ...event,
        timestamp: new Date().toISOString(),
        is_processed: false,
      });
    });
  }

  saveDatabase();
}

export async function seedDatabase() {
  // Database is already seeded in initDatabase
  return;
}

// Database operations
export function getDatabase() {
  if (!db) {
    db = loadDatabase();
  }
  return {
    prepare: (query: string) => {
      const sql = query.trim().toLowerCase();

      if (sql.startsWith("select")) {
        return {
          get: (params?: any) => {
            if (sql.includes("users where email")) {
              return db.users.find((u) => u.email === params);
            }
            if (sql.includes("count(*) as count from traffic_events")) {
              return { count: db.traffic_events.length };
            }
            if (
              sql.includes("traffic_events") &&
              sql.includes("is_processed = false")
            ) {
              const unprocessed = db.traffic_events.filter(
                (e) => !e.is_processed
              );
              if (unprocessed.length === 0) {
                return null;
              }
              return unprocessed[
                Math.floor(Math.random() * unprocessed.length)
              ];
            }
            return null;
          },
          all: () => {
            if (sql.includes("traffic_events")) {
              return db.traffic_events;
            }
            return [];
          },
        };
      }

      if (sql.startsWith("insert")) {
        return {
          run: (...params: any[]) => {
            if (sql.includes("annotations")) {
              const [
                eventId,
                userId,
                licensePlateNumber,
                decision,
                issueReason,
                dmvMake,
                dmvModel,
                dmvColor,
              ] = params;
              const annotation: Annotation = {
                id: db.annotations.length + 1,
                event_id: eventId,
                user_id: userId,
                license_plate_number: licensePlateNumber,
                decision,
                issue_reason: issueReason,
                dmv_make: dmvMake,
                dmv_model: dmvModel,
                dmv_color: dmvColor,
                created_at: new Date().toISOString(),
              };
              db.annotations.push(annotation);
            }
            saveDatabase();
          },
        };
      }

      if (sql.startsWith("update")) {
        return {
          run: (...params: any[]) => {
            if (sql.includes("traffic_events set is_processed = true")) {
              const eventId = params[0];
              const event = db.traffic_events.find((e) => e.id === eventId);
              if (event) {
                event.is_processed = true;
              }
            }
            saveDatabase();
          },
        };
      }

      return {
        run: () => {},
        get: () => null,
        all: () => [],
      };
    },
    exec: (query: string) => {
      // For CREATE TABLE statements, we don't need to do anything
      // as our JSON structure handles this
    },
  };
}

export default getDatabase;
