import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Bazaar } from '../../domain/models/bazaar.model';
import { BazaarRepository } from '../../application/ports/bazaar.repository';

interface BazaarRecord {
  readonly id: number;
  readonly name: string;
  readonly lat: number;
  readonly lng: number;
  readonly city: string;
  readonly state: string;
  readonly openToday: boolean;
  readonly isActive: boolean;
}

/**
 * File-backed implementation of the repository port.
 * Replace this adapter with an API adapter without changing the UI or use cases.
 */
@Injectable()
export class HttpBazaarRepository implements BazaarRepository {
  private readonly http = inject(HttpClient);
  private readonly dataUrl = 'assets/data/bazaars.json';

  getAll(): Observable<readonly Bazaar[]> {
    return this.http.get<unknown>(this.dataUrl).pipe(
      map((payload) => this.parseRecords(payload).map((record) => this.toDomain(record))),
    );
  }

  private parseRecords(payload: unknown): readonly BazaarRecord[] {
    if (!Array.isArray(payload) || !payload.every((record) => this.isBazaarRecord(record))) {
      throw new Error('The bazaar data has an invalid format.');
    }

    const records = payload as BazaarRecord[];
    if (new Set(records.map((record) => record.id)).size !== records.length) {
      throw new Error('The bazaar data contains duplicate ids.');
    }

    return records;
  }

  private isBazaarRecord(value: unknown): value is BazaarRecord {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const record = value as Record<string, unknown>;
    return (
      Number.isInteger(record['id']) &&
      typeof record['name'] === 'string' &&
      record['name'].trim().length > 0 &&
      typeof record['lat'] === 'number' &&
      Number.isFinite(record['lat']) &&
      record['lat'] >= -90 &&
      record['lat'] <= 90 &&
      typeof record['lng'] === 'number' &&
      Number.isFinite(record['lng']) &&
      record['lng'] >= -180 &&
      record['lng'] <= 180 &&
      typeof record['city'] === 'string' &&
      record['city'].trim().length > 0 &&
      typeof record['state'] === 'string' &&
      record['state'].trim().length > 0 &&
      typeof record['openToday'] === 'boolean' &&
      typeof record['isActive'] === 'boolean'
    );
  }

  private toDomain(record: BazaarRecord): Bazaar {
    return {
      id: record.id,
      name: record.name,
      location: {
        latitude: record.lat,
        longitude: record.lng,
      },
      city: record.city,
      state: record.state,
      openToday: record.openToday,
      isActive: record.isActive,
    };
  }
}
