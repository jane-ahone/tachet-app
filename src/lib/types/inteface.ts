interface Customer {
  id: number;
  customerName: string;
  phoneNumber: string;
  email: string;
  homeAddress: string;
}

interface Order {
  id: number;
  customerId: number;
  orderQty: number;
  orderDate: string;
  status: string;
}

interface OrderData {
  customerId: string;
  orderQty: number;
  orderDate: string;
}
