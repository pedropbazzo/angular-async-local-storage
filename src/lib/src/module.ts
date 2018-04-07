import { NgModule, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { LocalStorage } from './service/lib.service';
import { LocalDatabase, IndexedDBDatabase, LocalStorageDatabase, MockLocalDatabase } from './service/databases/index';

export function asyncLocalStorageFactory(platformId: Object) {

    let database: LocalDatabase;

    if (isPlatformBrowser(platformId) && ('indexedDB' in window) && (indexedDB !== undefined) && (indexedDB !== null)) {

      /* Try with IndexedDB in modern browsers */
      database = new IndexedDBDatabase();

    } else if (isPlatformBrowser(platformId) && ('localStorage' in window) && (localStorage !== undefined) && (localStorage !== null)) {

      /* Try with localStorage in old browsers (IE9) */
      database = new LocalStorageDatabase();

    } else {

      /* Fake database for server-side rendering (Universal) */
      database = new MockLocalDatabase();

    }

    return new LocalStorage(database);

};

@NgModule({
    providers: [
        {
            provide: LocalStorage,
            useFactory: asyncLocalStorageFactory,
            deps: [PLATFORM_ID]
        }
    ]
})
export class LocalStorageModule {}
