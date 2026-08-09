import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { BAZAAR_REPOSITORY, BazaarRepository } from '../ports/bazaar.repository';
import { GetActiveBazaarsUseCase } from './get-active-bazaars.use-case';
import { Bazaar } from '../../domain/models/bazaar.model';

describe('GetActiveBazaarsUseCase', () => {
  let repository: jasmine.SpyObj<BazaarRepository>;

  beforeEach(() => {
    repository = jasmine.createSpyObj<BazaarRepository>('BazaarRepository', ['getAll']);

    TestBed.configureTestingModule({
      providers: [
        GetActiveBazaarsUseCase,
        { provide: BAZAAR_REPOSITORY, useValue: repository },
      ],
    });
  });

  it('returns only active bazaars', async () => {
    const bazaars: Bazaar[] = [
      createBazaar({ id: 1, isActive: true }),
      createBazaar({ id: 2, isActive: false }),
    ];
    repository.getAll.and.returnValue(of(bazaars));

    const result = await firstValueFrom(TestBed.inject(GetActiveBazaarsUseCase).execute());

    expect(result.map((bazaar) => bazaar.id)).toEqual([1]);
  });
});

function createBazaar(overrides: Partial<Bazaar>): Bazaar {
  return {
    id: 0,
    name: 'Sample bazaar',
    location: { latitude: 3, longitude: 101 },
    city: 'Kuala Lumpur',
    state: 'Selangor',
    openToday: true,
    isActive: true,
    ...overrides,
  };
}
