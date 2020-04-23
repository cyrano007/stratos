import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import {
  createEntityRelationPaginationKey,
} from '../../../../../../../cloud-foundry/src/entity-relations/entity-relations.types';
import {
  ListDataSource,
} from '../../../../../../../core/src/shared/components/list/data-sources-controllers/list-data-source';
import { IListConfig } from '../../../../../../../core/src/shared/components/list/list.component.types';
import { EntityCatalogHelper } from '../../../../../../../store/src/entity-catalog/entity-catalog.service';
import { APIResource } from '../../../../../../../store/src/types/api.types';
import { CFAppState } from '../../../../../cf-app-state';
import { cfEntityFactory } from '../../../../../cf-entity-factory';
import { cfEntityCatalog } from '../../../../../cf-entity-service';
import { appEnvVarsEntityType, applicationEntityType } from '../../../../../cf-entity-types';
import { ApplicationService } from '../../../../../features/applications/application.service';
import { AppEnvVarsState } from '../../../../../store/types/app-metadata.types';

export interface ListAppEnvVar {
  name: string;
  value: string;
}

export class CfAppVariablesDataSource extends ListDataSource<ListAppEnvVar, APIResource<AppEnvVarsState>> {

  public cfGuid: string;
  public appGuid: string;
  private ech: EntityCatalogHelper;

  constructor(
    store: Store<CFAppState>,
    appService: ApplicationService,
    listConfig: IListConfig<ListAppEnvVar>,
    ech: EntityCatalogHelper
  ) {
    // const appEnvVarsEntity = entityCatalog.getEntity(CF_ENDPOINT_TYPE, appEnvVarsEntityType);
    // const actionBuilder = appEnvVarsEntity.actionOrchestrator.getActionBuilder('get');
    // const getAppEnvVarsAction = actionBuilder(appService.appGuid, appService.cfGuid) as PaginatedAction;
    const getAppEnvVarsAction = cfEntityCatalog.appEnvVar.actions.get(appService.appGuid, appService.cfGuid);

    super({
      store,
      action: getAppEnvVarsAction,
      schema: cfEntityFactory(appEnvVarsEntityType),
      getRowUniqueId: object => object.name,
      getEmptyType: () => ({ name: '', value: '', }),
      paginationKey: createEntityRelationPaginationKey(applicationEntityType, appService.appGuid),
      transformEntity: map(variables => {
        if (!variables || variables.length === 0) {
          return [];
        }
        const env = variables[0].entity.environment_json;
        const rows = Object.keys(env).map(name => ({ name, value: env[name] }));
        return rows;
      }),
      isLocal: true,
      transformEntities: [{ type: 'filter', field: 'name' }],
      listConfig
    });

    this.cfGuid = appService.cfGuid;
    this.appGuid = appService.appGuid;
    this.ech = ech;
  }

  saveAdd() {
    // const appEnvVarsEntity = entityCatalog.getEntity(CF_ENDPOINT_TYPE, appEnvVarsEntityType);
    // const actionBuilder = appEnvVarsEntity.actionOrchestrator.getActionBuilder('addNewToApplication');
    // const appVariablesAddAction = actionBuilder(this.appGuid, this.cfGuid, this.transformedEntities, this.addItem);
    // this.store.dispatch(appVariablesAddAction);
    cfEntityCatalog.appEnvVar.api.addNewToApplication(this.ech, this.appGuid, this.cfGuid, this.transformedEntities, this.addItem);


    super.saveAdd();
  }

  startEdit(row: ListAppEnvVar) {
    super.startEdit({ ...row });
  }

  saveEdit() {
    // const appEnvVarsEntity = entityCatalog.getEntity(CF_ENDPOINT_TYPE, appEnvVarsEntityType);
    // const actionBuilder = appEnvVarsEntity.actionOrchestrator.getActionBuilder('editInApplication');
    // const appVariablesEditAction = actionBuilder(this.appGuid, this.cfGuid, this.transformedEntities, this.editRow);
    // this.store.dispatch(appVariablesEditAction);
    cfEntityCatalog.appEnvVar.api.editInApplication(this.ech, this.appGuid, this.cfGuid, this.transformedEntities, this.editRow);

    super.saveEdit();
  }

}
