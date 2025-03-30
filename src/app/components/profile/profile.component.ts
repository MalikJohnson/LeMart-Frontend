import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any;
  isEditing = false;
  isSaving = false; // Added missing property
  isLoading = false;
  errorMessage: string | null = null;
  profileForm: FormGroup;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      streetAddress: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const userId = this.authService.getUserId();
    if (!userId) {
      this.handleUnauthorized();
      return;
    }

    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Profile load error', err);
        this.errorMessage = 'Failed to load profile';
        this.toastr.error(this.errorMessage);
        if (err.status === 401) {
          this.handleUnauthorized();
        }
      }
    });
  }

  private handleUnauthorized(): void {
    this.authService.logout();
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: this.router.url }
    });
  }

  startEditing(): void {
    if (!this.user) return;
    this.profileForm.patchValue(this.user);
    this.isEditing = true;
  }

  cancelEditing(): void {
    this.isEditing = false;
  }

  saveProfile(): void {
    if (!this.user || this.profileForm.invalid) return;

    this.isSaving = true;
    this.userService.updateUser(this.user.id, this.profileForm.value).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.isEditing = false;
        this.isSaving = false;
        this.toastr.success('Profile updated successfully');
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Profile update error', err);
        this.toastr.error('Failed to update profile');
        if (err.status === 401) {
          this.handleUnauthorized();
        }
      }
    });
  }
}