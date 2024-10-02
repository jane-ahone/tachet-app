export interface Customer {
  customer_id: number;
  customer_name: string;
  phone_number: string;
  email: string;
  home_address: string;
}

export interface Purchase {
  purchase_id: number;
  purchase_date: string;
  item_type: string;
  quantity: number;
  rejected_quantity: number;
  amount: number;
  custom_item_type?: string;
  order_id?: number; // Optional because not all purchases (e.g., labels) are linked to orders
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
  volume_purchased: number;
  volume_processed: number;
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
