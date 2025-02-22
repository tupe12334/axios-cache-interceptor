/** @jest-environment jsdom */

import { Axios } from 'axios';
import { buildStorage, canStale, isStorage } from '../../src/storage/build';
import { buildMemoryStorage } from '../../src/storage/memory';
import type { AxiosStorage, StorageValue } from '../../src/storage/types';
import { buildWebStorage } from '../../src/storage/web-api';
import { mockAxios } from '../mocks/axios';

describe('tests general storage functions', () => {
  it('tests isStorage function', () => {
    expect(isStorage(void 0)).toBe(false);
    expect(isStorage(1)).toBe(false);
    expect(isStorage('a')).toBe(false);
    expect(isStorage({})).toBe(false);
    expect(isStorage(Axios)).toBe(false);
    expect(isStorage(() => 0)).toBe(false);
    expect(isStorage(null)).toBe(false);
    expect(isStorage(undefined)).toBe(false);
    expect(isStorage({ a: 1, b: 'a' })).toBe(false);

    expect(isStorage(buildMemoryStorage())).toBe(true);
    expect(isStorage(buildWebStorage(localStorage))).toBe(true);
    expect(isStorage(buildWebStorage(sessionStorage))).toBe(true);
  });

  it('tests setupCache without proper storage', () => {
    expect(() =>
      mockAxios({
        storage: {} as AxiosStorage
      })
    ).toThrowError();
  });

  it('tests that a normal request workflow will always have a currentRequest', async () => {
    const memory: Record<string, StorageValue> = {};
    const isCR = 'unique-RANDOM-key-8ya5re28364ri';

    const storage = buildStorage({
      find(key, cr) {
        //@ts-expect-error ignore
        expect(cr[isCR]).toBe(true);
        return memory[key];
      },
      set(key, value, cr) {
        //@ts-expect-error ignore
        expect(cr[isCR]).toBe(true);
        memory[key] = value;
      },
      remove(key, cr) {
        //@ts-expect-error ignore
        expect(cr[isCR]).toBe(true);
        delete memory[key];
      }
    });

    const axios = mockAxios({ storage });
    //@ts-expect-error ignore
    axios.defaults[isCR] = true;

    const req1 = axios.get('https://api.example.com/');
    const req2 = axios.get('https://api.example.com/');

    const [res1, res2] = await Promise.all([req1, req2]);

    expect(res1.status).toBe(200);
    expect(res1.cached).toBeFalsy();

    expect(res2.status).toBe(200);
    expect(res2.cached).toBeTruthy();

    expect(res1.id).toBe(res2.id);

    const cache = await axios.storage.get(res1.id, {
      // sample of a request config. Just to the test pass.
      //@ts-expect-error ignore
      [isCR]: true
    });

    expect(cache.state).toBe('cached');
  });

  it('tests canStale function with normal timestamps', () => {
    // ttl + staleTtl + createdAt = future
    expect(
      canStale({
        data: {
          headers: {},
          data: true,
          status: 200,
          statusText: 'OK'
        },
        createdAt: Date.now(),
        state: 'cached',
        ttl: 1000,
        staleTtl: 1000
      })
    ).toBeTruthy();

    // ttl + staleTtl + createdAt = past
    expect(
      canStale({
        data: {
          headers: {},
          data: true,
          status: 200,
          statusText: 'OK'
        },
        createdAt: Date.now() - 2001,
        state: 'cached',
        ttl: 1000,
        staleTtl: 1000
      })
    ).toBeFalsy();

    // createdAt + ttl + (0 staleTtl) = future
    expect(
      canStale({
        data: {
          headers: {},
          data: true,
          status: 200,
          statusText: 'OK'
        },
        createdAt: Date.now(),
        state: 'cached',
        ttl: 9999999,
        staleTtl: 0
      })
    ).toBeFalsy();

    // createdAt + ttl = past, + staleTtl = future
    expect(
      canStale({
        data: {
          headers: {},
          data: true,
          status: 200,
          statusText: 'OK'
        },
        createdAt: Date.now(),
        state: 'cached',
        ttl: 0,
        staleTtl: 1000
      })
    ).toBeTruthy();
  });

  it('tests canStale function with must-revalidate', () => {
    // Normal request, but without must-revalidate
    expect(
      canStale({
        data: {
          headers: {
            'Cache-Control': 'max-age=1'
          },
          data: true,
          status: 200,
          statusText: 'OK'
        },
        createdAt: Date.now(),
        state: 'cached',
        ttl: 1000,
        staleTtl: 1000
      })
    ).toBeTruthy();

    // Normal request, but with must-revalidate
    expect(
      canStale({
        data: {
          headers: {
            'cache-control': 'must-revalidate, max-age=1'
          },
          data: true,
          status: 200,
          statusText: 'OK'
        },
        createdAt: Date.now(),
        state: 'cached',
        ttl: 1000,
        staleTtl: 1000
      })
    ).toBeFalsy();
  });
});
