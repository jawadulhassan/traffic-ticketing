import { initDatabase, seedDatabase } from "../lib/database-json";

async function main() {
  try {
    console.log("Initializing database...");
    initDatabase();
    console.log("Database initialized successfully");

    console.log("Seeding database with sample data...");
    await seedDatabase();
    console.log("Database seeded successfully");

    console.log("Database setup complete!");
    console.log("\nDemo credentials:");
    console.log("Email: demo@traffic.com");
    console.log("Password: demo123");
  } catch (error) {
    console.error("Error setting up database:", error);
    process.exit(1);
  }
}

main();
