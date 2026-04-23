// @ts-nocheck
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
  rating: number;
  reviewsCount: number;
  salePrice?: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface OrderTimeline {
  status: string;
  date: Date;
  description: string;
  icon: string;
  completed: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  date: Date;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Paid' | 'Unpaid' | 'Refunded';
  items: OrderItem[];
  timeline: OrderTimeline[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  location: string;
  joinDate: Date;
  ltv: number; // Lifetime Value
  ordersCount: number;
  status: 'Active' | 'Inactive';
  lastActive: Date;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  customer: Partial<Customer>;
  issueDate: Date;
  dueDate: Date;
  total: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  items: { description: string; qty: number; unitPrice: number; total: number }[];
}

