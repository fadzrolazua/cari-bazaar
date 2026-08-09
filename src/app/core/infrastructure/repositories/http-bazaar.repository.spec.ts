import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Bazaar } from '../../domain/models/bazaar.model';
import { HttpBazaarRepository } from './http-bazaar.repository';

describe('HttpBazaarRepository', () => {
  let repository: HttpBazaarRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpBazaarRepository, provideHttpClient(), provideHttpClientTesting()],
    });

    repository = TestBed.inject(HttpBazaarRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('rejects malformed records instead of rendering invalid markers', (done) => {
    repository.getAll().subscribe({
      next: () => fail('Expected malformed data to fail.'),
      error: (error: Error) => {
        expect(error.message).toContain('invalid format');
        done();
      },
    });

    const request = http.expectOne('assets/data/bazaars.json');
    request.flush([{ id: 'not-a-number' }]);
  });

  it('maps storage coordinates into the domain model', () => {
    let result: readonly Bazaar[] = [];

    repository.getAll().subscribe((bazaars) => {
      result = bazaars;
    });

    const request = http.expectOne('assets/data/bazaars.json');
    expect(request.request.method).toBe('GET');

    request.flush([
      {
        id: 1,
        name: 'Sample bazaar',
        lat: 3.1,
        lng: 101.7,
        city: 'Kuala Lumpur',
        state: 'Kuala Lumpur',
        openToday: true,
        isActive: true,
      },
    ]);

    expect(result[0].location).toEqual({ latitude: 3.1, longitude: 101.7 });
  });
});
