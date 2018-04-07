import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toPromise';

import { LocalStorage } from './lib.service';
import { IndexedDBDatabase } from './databases/indexeddb-database';
import { LocalStorageDatabase } from './databases/localstorage-database';
import { MockLocalDatabase } from './databases/mock-local-database';
import { AsyncLocalStorage } from "../../index";

function testGetItem<T>(type: 'primitive' | 'object', localStorage: LocalStorage, value: T, done: DoneFn) {

  localStorage.setItem('test', value).subscribe(() => {

    localStorage.getItem<T>('test').subscribe((data) => {

      if (type === 'primitive') {
        expect(data).toBe(value);
      } else {
        expect(data).toEqual(value);
      }

      done();

    });

  });

}

function testGetItemPrimitive<T>(localStorage: LocalStorage, value: T, done: DoneFn) {

  testGetItem<T>('primitive', localStorage, value, done);

}

function testGetItemObject<T>(localStorage: LocalStorage, value: T, done: DoneFn) {

  testGetItem<T>('object', localStorage, value, done);

}

function tests(localStorage: LocalStorage) {

  beforeEach((done: DoneFn) => {
    localStorage.clear().subscribe(() => {
      done();
    });
  });

  it('should return null on unknown index', (done: DoneFn) => {

    localStorage.getItem('unknown').subscribe((data) => {

      expect(data).toBeNull();

      done();

    });

  });

  it('should store and return a string', (done: DoneFn) => {

    testGetItemPrimitive<string>(localStorage, 'blue', done);

  });

  it('should store and return an empty string', (done: DoneFn) => {

    testGetItemPrimitive<string>(localStorage, '', done);

  });

  it('should store and return a number', (done: DoneFn) => {

    testGetItemPrimitive<number>(localStorage, 10, done);

  });

  it('should store and return zero', (done: DoneFn) => {

    testGetItemPrimitive<number>(localStorage, 0, done);

  });

  it('should store and return true', (done: DoneFn) => {

    testGetItemPrimitive<boolean>(localStorage, true, done);

  });

  it('should store and return false', (done: DoneFn) => {

    testGetItemPrimitive<boolean>(localStorage, false, done);

  });

  it('should store and return null', (done: DoneFn) => {

    testGetItemPrimitive<null>(localStorage, null, done);

  });

  it('should store and return an array', (done: DoneFn) => {

    testGetItemObject<number[]>(localStorage, [1, 2, 3], done);

  });

  it('should store and return an object', (done: DoneFn) => {

    testGetItemObject<{name: string}>(localStorage, { name: 'test' }, done);

  });

  it('should return null on deleted index', (done: DoneFn) => {

    const index = 'test';

    localStorage.setItem(index, 'test').subscribe(() => {

      localStorage.removeItem(index).subscribe(() => {

        localStorage.getItem<string>(index).subscribe((data) => {

          expect(data).toBeNull();

          done();

        });

      });

    });

  });

  it('should allow to use operators', (done: DoneFn) => {

    const index = 'index';
    const value = 'value';

    localStorage.setItem(index, value).subscribe(() => {

      localStorage.getItem<string>(index).map((data) => data).subscribe((data) => {

        expect(data).toBe(value);

        done();

      });

    });

  });

  it('should call complete on setItem', (done: DoneFn) => {

    localStorage.setItem('index', 'value').subscribe({ complete: () => { done(); } });

  });

  it('should call complete on existing getItem', (done: DoneFn) => {

    const index = 'index';
    const value = 'value';

    localStorage.setItem(index, value).subscribe(() => {

      localStorage.getItem<string>(index).subscribe({ complete: () => { done(); } });

    });

  });

  it('should call complete on unexisting getItem', (done: DoneFn) => {

    localStorage.getItem<string>('notexisting').subscribe({ complete: () => { done(); } });

  });

  it('should call complete on existing removeItem', (done: DoneFn) => {

    const index = 'index';

    localStorage.setItem(index, 'value').subscribe(() => {

      localStorage.removeItem(index).subscribe({ complete: () => { done(); } });

    });

  });

  it('should call complete on unexisting removeItem', (done: DoneFn) => {

    localStorage.removeItem('notexisting').subscribe({ complete: () => { done(); } });

  });

  it('should call complete on clear', (done: DoneFn) => {

    localStorage.clear().subscribe({ complete: () => { done(); } });

  });

  it('should be OK if user manually used first() to complete', (done: DoneFn) => {

    localStorage.clear().first().subscribe({ complete: () => { done(); } });

  });

  it('should be OK if user manually used take(1) to complete', (done: DoneFn) => {

    localStorage.clear().take(1).subscribe({ complete: () => { done(); } });

  });

  it('should be able to update an existing index', (done: DoneFn) => {

    const index = 'index';

    localStorage.setItem(index, 'value').subscribe(() => {

      localStorage.setItem(index, 'updated').subscribe(() => {
        done();
      }, () => {
        fail();
      });

    });

  });

  it('should work in a Promise-way', (done: DoneFn) => {

    const index = 'index';
    const value = 'test';

    localStorage.setItem(index, value).toPromise()
    .then(() => localStorage.getItem(index).toPromise())
    .then((result) => {
      expect(result).toBe(value);
      done();
    }, () => {
      fail();
    });

  });

}

describe('LocalStorage with mock storage', () => {

  let localStorage = new LocalStorage(new MockLocalDatabase());

  tests(localStorage);

});

describe('LocalStorage with localStorage', () => {

  let localStorage = new LocalStorage(new LocalStorageDatabase());

  tests(localStorage);

});

describe('LocalStorage with IndexedDB', () => {

  let localStorage = new LocalStorage(new IndexedDBDatabase());

  tests(localStorage);

});

describe('AsyncLocalStorage with IndexedDB', () => {

  let localStorage = new AsyncLocalStorage(new IndexedDBDatabase());

  tests(localStorage);

});
