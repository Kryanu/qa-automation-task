import { APIRequestContext } from '@playwright/test';

export const BASE_URL = 'https://petstore.swagger.io/v2';

export interface Category {
  id?: number;
  name?: string;
}

export interface Tag {
  id?: number;
  name?: string;
}

export type PetStatus = 'available' | 'pending' | 'sold';

export interface Pet {
  id?: number;
  category?: Category;
  name: string;
  photoUrls: string[];
  tags?: Tag[];
  status?: PetStatus;
}

export function buildPet(overrides?: Partial<Pet>): Pet {
  return {
    id: Date.now(),
    name: 'doggie',
    photoUrls: ['https://example.com/dog.png'],
    status: 'available',
    ...overrides,
  };
}

export async function createPet(request: APIRequestContext, pet: Pet) {
  return request.post(`${BASE_URL}/pet`, { data: pet });
}

export async function getPetById(request: APIRequestContext, petId: number) {
  return request.get(`${BASE_URL}/pet/${petId}`);
}
