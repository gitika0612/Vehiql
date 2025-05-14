import { Decimal } from "@prisma/client/runtime/library";

// Raw Car type, as it may come from Prisma or AI or DB
export interface Car {
  id: string;
  price: Decimal | number | string;
  mileage?: number;
  createdAt?: Date;
  updatedAt?: Date;
  make?: string;
  model?: string;
  year?: number;
  status?: string;
  color?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  seats?: number | null; 
  description?: string;
  featured?: boolean;
  images?: string[];
}

// Final CarDetails used by frontend – with all normalized values
export interface CarDetails {
  id: string;
  price: number;
  mileage: number;
  createdAt: Date;
  updatedAt: Date;
  make?: string;
  model?: string;
  year?: number;
  status?: string;
  color?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  seats?: number | null;
  description?: string;
  featured?: boolean;
  images?: string[];
  wishlisted: boolean;
}


// Function to format a number into currency format
export const formatCurrency = (amount: number | string | Decimal): string => {
  // Handle Decimal type conversion, number, and string
  const formattedAmount = 
    amount instanceof Decimal ? amount.toNumber() : 
    typeof amount === "string" ? parseFloat(amount) : 
    amount;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(formattedAmount);
};

// Helper function to serialize car data
export const serializeCarData = (car: Car, wishlisted: boolean = false): CarDetails => {
  const price =
    car.price instanceof Decimal ? car.price.toNumber() :
    typeof car.price === "string" ? parseFloat(car.price) :
    car.price;

  const mileage =
    typeof car.mileage === "string" ? parseFloat(car.mileage) :
    typeof car.mileage === "number" ? car.mileage : 0;

  return {
    ...car,
    price,
    mileage,
    createdAt: car.createdAt || new Date(),
    updatedAt: car.updatedAt || new Date(),
    wishlisted,
  };
};

