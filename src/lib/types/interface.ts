export interface Customer {
  customer_id: number;
  customer_name: string;
  phone_number: string;
  email: string;
  home_address: string;
}

export interface Purchase {
  id: number;
  date: string;
  itemType: string;
  quantity: number;
  price: number;
  customItemType?: string;
  orderId?: number; // Optional because not all purchases (e.g., labels) are linked to orders
}

export interface Order {
  order_id: number;
  customer_id: number;
  customer_name: string;
  order_qty: number;
  order_date: string;
  status: string;
}

export interface Tapper {
  tapper_id: number;
  tapper_name: string;
  phone_number: string;
  email: string;
  home_address: string;
  joiningDate?: string;
}

export interface ProductionData {
  date_received: string;
  order_id: number;
  tapper_id: number;
  volume_purchased: string;
  tapper_payment_status: string;
}

export interface OrderData {
  customer_id: number;
  customer_name: string;
  order_qty: number;
  order_date: string;
  status: string;
}
export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  options?: { value: string; label: string }[];
  required?: boolean;
}

export interface SessionData {
  userId?: number;
  username?: string;
  email?: string;
  isLoggedIn: boolean;
}
