// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, Order, Customer, Invoice } from './ecommerce.model';

@Injectable({
  providedIn: 'root',
})
export class EcommerceService {
  private _products = new BehaviorSubject<Product[]>([]);
  public products$ = this._products.asObservable();

  private _orders = new BehaviorSubject<Order[]>([]);
  public orders$ = this._orders.asObservable();

  private _customers = new BehaviorSubject<Customer[]>([]);
  public customers$ = this._customers.asObservable();

  private _invoices = new BehaviorSubject<Invoice[]>([]);
  public invoices$ = this._invoices.asObservable();

  private mockProducts: Product[] = [
    {
      id: 'P1',
      name: 'Ultra Hybrid Pro Case',
      description: 'Durable protection with a crystal-clear hybrid design.',
      price: 49.99,
      category: 'Accessories',
      stock: 156,
      status: 'In Stock',
      image: 'assets/images/products/p1.jpg',
      rating: 4.8,
      reviewsCount: 124,
      salePrice: 39.99,
    },
    {
      id: 'P2',
      name: 'Wireless Noise Cancelling Headphones',
      description: 'Experience pure sound with our latest acoustic technology.',
      price: 299.00,
      category: 'Electronics',
      stock: 12,
      status: 'Low Stock',
      image: 'assets/images/products/p2.jpg',
      rating: 4.9,
      reviewsCount: 850,
    },
    {
      id: 'P3',
      name: 'Mechanical Gaming Keyboard',
      description: 'RGB backlit mechanical keyboard with blue switches.',
      price: 89.00,
      category: 'Gaming',
      stock: 45,
      status: 'In Stock',
      image: 'assets/images/products/p3.jpg',
      rating: 4.5,
      reviewsCount: 340,
    },
    {
      id: 'P4',
      name: 'Smart Watch Series 7',
      description: 'Track your health and stay connected on the go.',
      price: 399.00,
      category: 'Electronics',
      stock: 0,
      status: 'Out of Stock',
      image: 'assets/images/products/p4.jpg',
      rating: 4.7,
      reviewsCount: 2100,
    },
    {
      id: 'P5',
      name: 'Portable SSD 1TB',
      description: 'Ultrafast data transfer in a compact, rugged design.',
      price: 159.00,
      category: 'Electronics',
      stock: 88,
      status: 'In Stock',
      image: 'assets/images/products/p5.jpg',
      rating: 4.6,
      reviewsCount: 450,
    },
    {
      id: 'P6',
      name: 'MacBook Pro 14"',
      description: 'Powerful performance with the M2 chip.',
      price: 1999.00,
      category: 'Electronics',
      stock: 25,
      status: 'In Stock',
      image: 'assets/images/products/p6.jpg',
      rating: 4.9,
      reviewsCount: 120,
    },
    {
      id: 'P7',
      name: 'iPhone 15 Pro',
      description: 'The latest iPhone with titanium design.',
      price: 1099.00,
      category: 'Electronics',
      stock: 40,
      status: 'In Stock',
      image: 'assets/images/products/p7.jpg',
      rating: 4.8,
      reviewsCount: 3500,
    },
    {
      id: 'P8',
      name: 'iPad Air',
      description: 'Light, bright, and powerful tablet.',
      price: 599.00,
      category: 'Electronics',
      stock: 15,
      status: 'Low Stock',
      image: 'assets/images/products/p8.jpg',
      rating: 4.7,
      reviewsCount: 890,
    },
    {
      id: 'P9',
      name: 'Logitech MX Master 3S',
      description: 'Precision wireless mouse for productivity.',
      price: 99.00,
      category: 'Accessories',
      stock: 200,
      status: 'In Stock',
      image: 'assets/images/products/p9.jpg',
      rating: 4.9,
      reviewsCount: 1500,
    },
    {
      id: 'P11',
      name: 'Bose QuietComfort Ultra',
      description: 'The ultimate noise cancelling earbuds.',
      price: 299.00,
      category: 'Electronics',
      stock: 50,
      status: 'In Stock',
      image: 'assets/images/products/p11.jpg',
      rating: 4.8,
      reviewsCount: 300,
    },
    {
      id: 'P12',
      name: 'Sony A7 IV Mirrorless Camera',
      description: 'Professional full-frame mirrorless camera.',
      price: 2499.00,
      category: 'Electronics',
      stock: 8,
      status: 'Low Stock',
      image: 'assets/images/products/p12.jpg',
      rating: 4.9,
      reviewsCount: 150,
    },
    {
      id: 'P13',
      name: 'Herman Miller Aeron Chair',
      description: 'The gold standard of office ergonomic chairs.',
      price: 1800.00,
      category: 'Office',
      stock: 12,
      status: 'In Stock',
      image: 'assets/images/products/p13.jpg',
      rating: 4.7,
      reviewsCount: 450,
    },
    {
      id: 'P14',
      name: 'Kindle Paperwhite',
      description: 'The best e-reader for book lovers.',
      price: 139.00,
      category: 'Electronics',
      stock: 100,
      status: 'In Stock',
      image: 'assets/images/products/p14.jpg',
      rating: 4.6,
      reviewsCount: 12000,
    },
    {
      id: 'P15',
      name: 'SteelSeries Arctis Nova Pro',
      description: 'Supreme audio for gaming professionals.',
      price: 349.00,
      category: 'Gaming',
      stock: 35,
      status: 'In Stock',
      image: 'assets/images/products/p15.jpg',
      rating: 4.8,
      reviewsCount: 1200,
    },
    {
      id: 'P16',
      name: 'Samsung Odyssey Neo G9',
      description: '49-inch curved gaming monitor with mini-LED.',
      price: 1799.00,
      category: 'Gaming',
      stock: 5,
      status: 'Low Stock',
      image: 'assets/images/products/p16.jpg',
      rating: 4.9,
      reviewsCount: 88,
    },
    {
      id: 'P17',
      name: 'Phillips Hue Starter Kit',
      description: 'Smart lighting for your entire home.',
      price: 199.00,
      category: 'Home Appliances',
      stock: 60,
      status: 'In Stock',
      image: 'assets/images/products/p17.jpg',
      rating: 4.7,
      reviewsCount: 5400,
    },
    {
      id: 'P18',
      name: 'Apple Watch Ultra 2',
      description: 'The most rugged and capable Apple Watch.',
      price: 799.00,
      category: 'Wearables',
      stock: 22,
      status: 'In Stock',
      image: 'assets/images/products/p18.jpg',
      rating: 4.9,
      reviewsCount: 450,
    }
  ];

  private mockOrders: Order[] = [
    {
      id: 'ORD-7721',
      customerName: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      date: new Date('2024-01-05T14:30:00'),
      total: 448.99,
      status: 'Processing',
      paymentStatus: 'Paid',
      items: [
        { productId: 'P2', name: 'Wireless Headphones', quantity: 1, price: 299.00, image: 'assets/images/products/p2.jpg' },
        { productId: 'P5', name: 'Portable SSD', quantity: 1, price: 149.99, image: 'assets/images/products/p5.jpg' }
      ],
      timeline: [
        { status: 'Order Placed', date: new Date('2024-01-05T14:30:00'), description: 'Order successfully placed by customer', icon: 'shopping_bag', completed: true },
        { status: 'Payment Confirmed', date: new Date('2024-01-05T14:35:00'), description: 'Payment of $448.99 received', icon: 'payment', completed: true },
        { status: 'Processing', date: new Date('2024-01-06T09:00:00'), description: 'Order is being packed at the warehouse', icon: 'inventory_2', completed: true },
        { status: 'Shipped', date: new Date(), description: 'Handed over to courier service', icon: 'local_shipping', completed: false },
        { status: 'Delivered', date: new Date(), description: 'Expected delivery by Jan 10', icon: 'done_all', completed: false }
      ]
    },
    {
      id: 'ORD-8842',
      customerName: 'John Doe',
      email: 'john.doe@example.com',
      date: new Date('2024-01-06T10:15:00'),
      total: 1099.00,
      status: 'Shipped',
      paymentStatus: 'Paid',
      items: [
        { productId: 'P7', name: 'iPhone 15 Pro', quantity: 1, price: 1099.00, image: 'assets/images/products/p7.jpg' }
      ],
      timeline: [
        { status: 'Order Placed', date: new Date('2024-01-06T10:15:00'), description: 'Order placed', icon: 'shopping_bag', completed: true },
        { status: 'Shipped', date: new Date('2024-01-07T11:00:00'), description: 'Order shipped via FedEx', icon: 'local_shipping', completed: true }
      ]
    },
    {
      id: 'ORD-9910',
      customerName: 'Emma Wilson',
      email: 'emma.w@example.com',
      date: new Date('2024-01-07T09:00:00'),
      total: 188.00,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      items: [
        { productId: 'P3', name: 'Gaming Keyboard', quantity: 1, price: 89.00, image: 'assets/images/products/p3.jpg' },
        { productId: 'P9', name: 'MX Master 3S', quantity: 1, price: 99.00, image: 'assets/images/products/p9.jpg' }
      ],
      timeline: [
        { status: 'Order Placed', date: new Date('2024-01-07T09:00:00'), description: 'Awaiting payment', icon: 'shopping_bag', completed: true }
      ]
    },
    {
      id: 'ORD-1025',
      customerName: 'Liam Johnson',
      email: 'liam.j@example.com',
      date: new Date('2024-01-07T15:45:00'),
      total: 2499.00,
      status: 'Processing',
      paymentStatus: 'Paid',
      items: [
        { productId: 'P12', name: 'Sony A7 IV', quantity: 1, price: 2499.00, image: 'assets/images/products/p12.jpg' }
      ],
      timeline: [
        { status: 'Order Placed', date: new Date('2024-01-07T15:45:00'), description: 'Order placed', icon: 'shopping_bag', completed: true },
        { status: 'Payment Confirmed', date: new Date('2024-01-07T15:50:00'), description: 'Payment confirmed', icon: 'payment', completed: true }
      ]
    }
  ];

  private mockCustomers: Customer[] = [
    {
      id: 'C1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: 'assets/images/user/user1.jpg',
      phone: '+1 234 567 890',
      location: 'New York, USA',
      joinDate: new Date('2023-05-12'),
      ltv: 1250.50,
      ordersCount: 8,
      status: 'Active',
      lastActive: new Date('2024-01-07')
    },
    {
      id: 'C2',
      name: 'Emma Wilson',
      email: 'emma.w@example.com',
      avatar: 'assets/images/user/user2.jpg',
      phone: '+1 987 654 321',
      location: 'London, UK',
      joinDate: new Date('2023-08-20'),
      ltv: 450.00,
      ordersCount: 3,
      status: 'Active',
      lastActive: new Date('2024-01-04')
    },
    {
      id: 'C3',
      name: 'Michael Brown',
      email: 'm.brown@example.com',
      avatar: 'assets/images/user/user3.jpg',
      phone: '+1 555 123 456',
      location: 'Chicago, USA',
      joinDate: new Date('2023-10-15'),
      ltv: 980.00,
      ordersCount: 5,
      status: 'Active',
      lastActive: new Date('2024-01-06')
    },
    {
      id: 'C4',
      name: 'Sophia Garcia',
      email: 'sophia.g@example.com',
      avatar: 'assets/images/user/user4.jpg',
      phone: '+1 444 888 999',
      location: 'Madrid, Spain',
      joinDate: new Date('2023-11-30'),
      ltv: 150.00,
      ordersCount: 1,
      status: 'Active',
      lastActive: new Date('2024-01-01')
    },
    {
      id: 'C5',
      name: 'Liam Johnson',
      email: 'liam.j@example.com',
      avatar: 'assets/images/user/user5.jpg',
      phone: '+1 222 333 444',
      location: 'Toronto, Canada',
      joinDate: new Date('2023-12-05'),
      ltv: 3200.00,
      ordersCount: 12,
      status: 'Active',
      lastActive: new Date('2024-01-07')
    },
    {
      id: 'C6',
      name: 'Olivia Martinez',
      email: 'olivia.m@example.com',
      avatar: 'assets/images/user/user6.jpg',
      phone: '+34 666 777 888',
      location: 'Barcelona, Spain',
      joinDate: new Date('2023-04-10'),
      ltv: 540.00,
      ordersCount: 4,
      status: 'Active',
      lastActive: new Date('2024-01-05')
    },
    {
      id: 'C7',
      name: 'Noah Smith',
      email: 'noah.s@example.com',
      avatar: 'assets/images/user/user7.jpg',
      phone: '+61 2 9876 5432',
      location: 'Sydney, Australia',
      joinDate: new Date('2023-06-18'),
      ltv: 2100.00,
      ordersCount: 7,
      status: 'Active',
      lastActive: new Date('2024-01-02')
    },
    {
      id: 'C8',
      name: 'Ava Davis',
      email: 'ava.d@example.com',
      avatar: 'assets/images/user/user8.jpg',
      phone: '+49 152 1234567',
      location: 'Berlin, Germany',
      joinDate: new Date('2023-09-22'),
      ltv: 85.00,
      ordersCount: 2,
      status: 'Inactive',
      lastActive: new Date('2023-12-15')
    }
  ];

  private mockInvoices: Invoice[] = [
    {
      id: 'INV-001',
      invoiceNo: 'LORAX-2024-001',
      customer: { name: 'Sarah Jenkins', email: 'sarah.j@example.com' },
      issueDate: new Date('2024-01-05'),
      dueDate: new Date('2024-01-20'),
      total: 448.99,
      status: 'Paid',
      items: [
        { description: 'Wireless Noise Cancelling Headphones', qty: 1, unitPrice: 299.00, total: 299.00 },
        { description: 'Portable SSD 1TB', qty: 1, unitPrice: 149.99, total: 149.99 }
      ]
    },
    {
      id: 'INV-002',
      invoiceNo: 'LORAX-2024-002',
      customer: { name: 'John Doe', email: 'john.doe@example.com' },
      issueDate: new Date('2024-01-06'),
      dueDate: new Date('2024-01-21'),
      total: 1099.00,
      status: 'Paid',
      items: [
        { description: 'iPhone 15 Pro', qty: 1, unitPrice: 1099.00, total: 1099.00 }
      ]
    },
    {
      id: 'INV-003',
      invoiceNo: 'LORAX-2024-003',
      customer: { name: 'Emma Wilson', email: 'emma.w@example.com' },
      issueDate: new Date('2024-01-07'),
      dueDate: new Date('2024-01-22'),
      total: 188.00,
      status: 'Sent',
      items: [
        { description: 'Mechanical Gaming Keyboard', qty: 1, unitPrice: 89.00, total: 89.00 },
        { description: 'Logitech MX Master 3S', qty: 1, unitPrice: 99.00, total: 99.00 }
      ]
    },
    {
      id: 'INV-004',
      invoiceNo: 'LORAX-2024-004',
      customer: { name: 'Liam Johnson', email: 'liam.j@example.com' },
      issueDate: new Date('2024-01-07'),
      dueDate: new Date('2024-01-22'),
      total: 2499.00,
      status: 'Paid',
      items: [
        { description: 'Sony A7 IV Mirrorless Camera', qty: 1, unitPrice: 2499.00, total: 2499.00 }
      ]
    },
    {
      id: 'INV-005',
      invoiceNo: 'LORAX-2024-005',
      customer: { name: 'Michael Brown', email: 'm.brown@example.com' },
      issueDate: new Date('2024-01-06'),
      dueDate: new Date('2024-01-21'),
      total: 980.00,
      status: 'Overdue',
      items: [
        { description: 'Herman Miller Aeron Chair', qty: 1, unitPrice: 1800.00, total: 1800.00 }
      ]
    },
    {
      id: 'INV-006',
      invoiceNo: 'LORAX-2024-006',
      customer: { name: 'Sophia Garcia', email: 'sophia.g@example.com' },
      issueDate: new Date('2024-01-03'),
      dueDate: new Date('2024-01-18'),
      total: 139.00,
      status: 'Paid',
      items: [
        { description: 'Kindle Paperwhite', qty: 1, unitPrice: 139.00, total: 139.00 }
      ]
    }
  ];

  constructor() {
    this._products.next(this.mockProducts);
    this._orders.next(this.mockOrders);
    this._customers.next(this.mockCustomers);
    this._invoices.next(this.mockInvoices);
  }

  // Basic search/filter methods
  getProducts(): Product[] {
    return this.mockProducts;
  }

  getOrderById(id: string): Order | undefined {
    return this.mockOrders.find(o => o.id === id);
  }
}

