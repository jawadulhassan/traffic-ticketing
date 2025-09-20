import { NextRequest, NextResponse } from "next/server";

// Mock DMV data - in a real application, this would call an actual DMV API
const mockDmvData = [
  { make: "Toyota", model: "Camry", color: "Silver" },
  { make: "Honda", model: "Civic", color: "Blue" },
  { make: "Ford", model: "F-150", color: "White" },
  { make: "Chevrolet", model: "Silverado", color: "Black" },
  { make: "Nissan", model: "Altima", color: "Red" },
  { make: "BMW", model: "3 Series", color: "Black" },
  { make: "Mercedes-Benz", model: "C-Class", color: "White" },
  { make: "Audi", model: "A4", color: "Gray" },
  { make: "Lexus", model: "ES", color: "Silver" },
  { make: "Hyundai", model: "Elantra", color: "Blue" },
  { make: "Kia", model: "Optima", color: "White" },
  { make: "Subaru", model: "Outback", color: "Green" },
  { make: "Mazda", model: "CX-5", color: "Red" },
  { make: "Volkswagen", model: "Jetta", color: "Black" },
  { make: "Tesla", model: "Model 3", color: "White" },
];

export async function POST(request: NextRequest) {
  try {
    const { licensePlate } = await request.json();

    if (!licensePlate) {
      return NextResponse.json(
        { error: "License plate number is required" },
        { status: 400 }
      );
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get random DMV data for demo purposes
    const randomIndex = Math.floor(Math.random() * mockDmvData.length);
    const dmvInfo = mockDmvData[randomIndex];

    return NextResponse.json({
      license_plate: licensePlate,
      make: dmvInfo.make,
      model: dmvInfo.model,
      color: dmvInfo.color,
      registration_date: "2020-05-15",
      expiration_date: "2025-05-15",
      owner_name: "John Doe",
      address: "123 Main St, Anytown, ST 12345",
    });
  } catch (error) {
    console.error("DMV lookup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
