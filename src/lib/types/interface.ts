export interface Customer {
  customer_id: number;
  customer_name: string;
  phone_number: string;
  email: string;
  home_address: string;
  registrationDate?: string;
}

export interface Purchase {
  id: number;
  date: string;
  itemType: string;
  quantity: number;
  price: number;
  orderId?: number; // Optional because not all purchases (e.g., labels) are linked to orders
}

export interface Order {
  id: number;
  customerId: number;
  customerName: string;
  orderQty: number;
  orderDate: string;
  status: string;
}

export interface Tapper {
  tapper_id: number;
  tapper_name: string;
  phone_number: string;
  email: string;
  home_address: string;
  joiningDate: string;
}

export interface ProductionData {
  date: string;
  orderId: string;
  tapperId: string;
  volumeCollected: string;
  volumePaidFor: string;
  paymentStatus: string;
  notes: string;
}

export interface OrderData {
  customerId: number;
  customerName: string;
  orderQty: number;
  orderDate: string;
  status: string;
}
export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  options?: { value: string; label: string }[];
  required?: boolean;
}
