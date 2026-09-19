import { APIRequestContext } from '@playwright/test';
import { BASE_URL } from './pet';

export type OrderStatus = 'placed' | 'approved' | 'delivered';

export interface Order {
  id?: number;
  petId?: number;
  quantity?: number;
  shipDate?: string;
  status?: OrderStatus;
  complete?: boolean;
}

export function buildOrder(overrides?: Partial<Order>): Order {
  return {
    id: Date.now(),
    petId: 1,
    quantity: 1,
    shipDate: new Date().toISOString(),
    status: 'placed',
    complete: true,
    ...overrides,
  };
}

export async function placeOrder(request: APIRequestContext, order: Order) {
  return request.post(`${BASE_URL}/store/order`, { data: order });
}

export async function deleteOrder(request: APIRequestContext, orderId: number) {
  return request.delete(`${BASE_URL}/store/order/${orderId}`);
}
