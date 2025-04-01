import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-cancel-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-cancel-modal.component.html',
  styleUrls: ['./confirm-cancel-modal.component.scss']
})
export class ConfirmCancelModalComponent {
  orderId!: number;
  orderTotal!: number;

  constructor(public activeModal: NgbActiveModal) {}
}