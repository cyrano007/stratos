import { Store } from '@ngrx/store';

import { ListDataSource } from '../../../../shared/components/list/data-sources-controllers/list-data-source';
import { IListConfig } from '../../../../shared/components/list/list.component.types';
import { getPaginationKey } from '../../../../store/actions/pagination.actions';
import { AppState } from '../../../../store/app-state';
import { BaseKubeGuid } from '../../kubernetes-page.types';
import { GetKubernetesPods } from '../../store/kubernetes.actions';

import { map } from 'rxjs/operators';
import { entityFactory, kubernetesPodsSchemaKey } from '../../../../store/helpers/entity-factory';
import { KubernetesPod } from '../../store/kube.types';
import { HelmReleaseService } from '../../services/helm-release.service';

export class HelmReleasePodsDataSource extends ListDataSource<KubernetesPod, any> {

  constructor(
    store: Store<AppState>,
    kubeGuid: BaseKubeGuid,
    listConfig: IListConfig<KubernetesPod>,
    helmReleaseService: HelmReleaseService,
  ) {
    super({
      store,
      action: new GetKubernetesPods(kubeGuid.guid),
      schema: entityFactory(kubernetesPodsSchemaKey),
      getRowUniqueId: object => object.name,
      paginationKey: getPaginationKey(kubernetesPodsSchemaKey, kubeGuid.guid),
      transformEntity: map((pods: KubernetesPod[]) =>
        pods.filter(p => p.metadata.labels['release'] === helmReleaseService.helmReleaseName)),
      isLocal: true,
      listConfig
    });
  }

}
