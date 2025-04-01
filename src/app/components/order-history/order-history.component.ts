import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Order, OrderStatus } from '../../models/order';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmCancelModalComponent } from './confirm-cancel-modal/confirm-cancel-modal.component';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbModalModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error = false;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = false;
    
    const userId = this.authService.getUserId();
    
    this.orderService.getUserOrders(userId).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading orders', err);
        this.error = true;
        this.loading = false;
        this.toastr.error('Failed to load orders');
      }
    });
  }

  canCancel(order: Order): boolean {
    return order.status === 'PENDING' || order.status === 'PROCESSING';
  }

  openCancelModal(order: Order): void {
    if (!this.canCancel(order)) return;

    const modalRef = this.modalService.open(ConfirmCancelModalComponent);
    modalRef.componentInstance.orderId = order.id;
    modalRef.componentInstance.orderTotal = order.totalAmount;

    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.cancelOrder(order.id);
      }
    }).catch(() => {});
  }

  cancelOrder(orderId: number): void {
    this.orderService.updateOrderStatus(orderId, 'CANCELLED').subscribe({
      next: () => {
        this.toastr.success('Order cancelled successfully');
        this.loadOrders(); // Refresh the list
      },
      error: (err) => {
        console.error('Error cancelling order', err);
        this.toastr.error('Failed to cancel order');
      }
    });
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case 'PENDING':
        return 'text-bg-warning';
      case 'PROCESSING':
        return 'text-bg-primary';
      case 'SHIPPED':
        return 'text-bg-info';
      case 'DELIVERED':
      case 'COMPLETED':
        return 'text-bg-success';
      case 'CANCELLED':
        return 'text-bg-danger';
      default:
        return 'text-bg-secondary';
    }
  }
}