import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { ToastService } from '@shared/services/toast.service';
import { StorageService } from '@shared/storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  constructor(
    private readonly graphql: GraphqlService,
    private readonly storageService: StorageService,
    private readonly toast: ToastService
  ) {}
}
