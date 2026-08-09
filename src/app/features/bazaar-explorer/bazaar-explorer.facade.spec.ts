import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GetActiveBazaarsUseCase } from '../../core/application/use-cases/get-active-bazaars.use-case';
import { GetUserLocationUseCase } from '../../core/application/use-cases/get-user-location.use-case';
import { Bazaar } from '../../core/domain/models/bazaar.model';
import { BazaarExplorerFacade } from './bazaar-explorer.facade';

describe('BazaarExplorerFacade', () => {
  const bazaars: Bazaar[] = [
    {
      id: 1,
      name: 'Jalan TAR',
      location: { latitude: 3.1596, longitude: 101.6994 },
      city: 'Kuala Lumpur',
      state: 'Kuala Lumpur',
      openToday: true,
      isActive: true,
    },
    {
      id: 2,
      name: 'Shah Alam Stadium',
      location: { latitude: 3.0826, longitude: 101.5437 },
      city: 'Shah Alam',
      state: 'Selangor',
      openToday: false,
      isActive: true,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BazaarExplorerFacade,
        {
          provide: GetActiveBazaarsUseCase,
          useValue: { execute: () => of(bazaars) },
        },
        {
          provide: GetUserLocationUseCase,
          useValue: {
            execute: () => of({ latitude: 3.14, longitude: 101.69 }),
          },
        },
      ],
    });
  });

  it('loads and filters bazaars by search and open status', () => {
    const facade = TestBed.inject(BazaarExplorerFacade);

    facade.load();
    expect(facade.totalCount()).toBe(2);

    facade.setSearchQuery('shah');
    expect(facade.visibleBazaars().map((bazaar) => bazaar.id)).toEqual([2]);

    facade.setSearchQuery('');
    facade.setOpenOnly(true);
    expect(facade.visibleBazaars().map((bazaar) => bazaar.id)).toEqual([1]);
  });

  it('shows the location only after it has been requested', () => {
    const facade = TestBed.inject(BazaarExplorerFacade);

    expect(facade.userLocation()).toBeNull();

    facade.requestUserLocation();
    expect(facade.userLocation()).toEqual({ latitude: 3.14, longitude: 101.69 });

    facade.clearUserLocation();
    expect(facade.userLocation()).toBeNull();
  });

  it('accepts only ids from the loaded collection', () => {
    const facade = TestBed.inject(BazaarExplorerFacade);
    facade.load();

    facade.selectBazaar(2);
    expect(facade.selectedBazaarId()).toBe(2);

    facade.selectBazaar(999);
    expect(facade.selectedBazaarId()).toBe(2);
  });

  it('clears a selection when filters hide it', () => {
    const facade = TestBed.inject(BazaarExplorerFacade);
    facade.load();
    facade.selectBazaar(1);

    facade.setSearchQuery('shah');

    expect(facade.selectedBazaarId()).toBeNull();
  });
});
