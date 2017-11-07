import {
  AppEventDetailDialogComponentComponent,
} from './app-event-detail-dialog-component/app-event-detail-dialog-component.component';
import {
  TableCellEventDetailComponent,
} from '../../../table/custom-cells/table-cell-event-detail/table-cell-event-detail.component';
import {
  TableCellEventActionComponent,
} from '../../../table/custom-cells/table-cell-event-action/table-cell-event-action.component';
import { AppEvent } from '../../../../data-sources/cf-app-events-data-source';
import { Component, OnInit } from '@angular/core';
import { TableCellCustom } from '../../../table/table-cell/table-cell-custom';
import {
  TableCellEventTimestampComponent
} from '../../../table/custom-cells/table-cell-event-timestamp/table-cell-event-timestamp.component';
import { MdDialog } from '@angular/material';

@Component({
  selector: 'app-card-event',
  templateUrl: './card-app-event.component.html',
  styleUrls: ['./card-app-event.component.scss']
})
export class CardEventComponent extends TableCellCustom<AppEvent> {
  timestampComponent = TableCellEventTimestampComponent;
  actorComponent = TableCellEventActionComponent;
  detailComponent = TableCellEventDetailComponent;

  constructor(private dialog: MdDialog) {
    super();
  }

  showDetails() {
    this.dialog.open(AppEventDetailDialogComponentComponent, {
      data: { row: this.row },
      disableClose: true
    });
  }
}
