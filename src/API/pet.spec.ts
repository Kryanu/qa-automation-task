import { expect, test } from '@playwright/test';
import { buildPet, createPet, getPetById } from './pet';

test.describe('Pet API', () => {
  test('can create a pet', async ({ request }) => {
    const pet = buildPet({ name: 'Rex' });

    const response = await createPet(request, pet);

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body).toMatchObject({
      id: pet.id,
      name: pet.name,
      status: pet.status,
    });
  });

  test('can get a pet by id after creating it', async ({ request }) => {
    const pet = buildPet({ name: 'Fido' });
    await createPet(request, pet);

    const response = await getPetById(request, pet.id!);

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.id).toBe(pet.id);
    expect(body.name).toBe(pet.name);
  });

  test('returns 404 for a pet that does not exist', async ({ request }) => {
    const response = await getPetById(request, 0);

    expect(response.status()).toBe(404);
  });
});
