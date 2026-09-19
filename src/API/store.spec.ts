import { expect, test } from '@playwright/test';
import { buildOrder, deleteOrder, placeOrder } from './store';

test.describe('Store Order API', () => {
  test('can place an order for a pet', async ({ request }) => {
    const order = buildOrder();

    const response = await placeOrder(request, order);

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body).toMatchObject({
      id: order.id,
      petId: order.petId,
      quantity: order.quantity,
      status: order.status,
    });
  });

  test('can delete an order that was placed', async ({ request }) => {
    const order = buildOrder();
    await placeOrder(request, order);

    const response = await deleteOrder(request, order.id!);

    expect(response.ok()).toBeTruthy();
  });

  test('deleting a non-existent order returns 404', async ({ request }) => {
    const response = await deleteOrder(request, 999999999);

    expect(response.status()).toBe(404);
  });
});
