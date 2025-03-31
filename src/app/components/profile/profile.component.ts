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
  user: any = null;
  isEditing = false;
  isLoading = false;
  profileForm: FormGroup;

  states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
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
    const userId = this.authService.getUserId();
    
    if (!userId) {
      this.toastr.error('User not authenticated');
      this.isLoading = false;
      return;
    }

    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue(user);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Profile load error:', err);
        this.toastr.error('Failed to load profile data');
        console.log('Token valid:', this.authService.hasValidToken());
        console.log('Token expiration:', this.authService.isTokenExpired());
      }
    });
  }

  startEditing(): void {
    this.isEditing = true;
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.profileForm.patchValue(this.user);
  }

  saveProfile(): void {
    if (this.profileForm.invalid || !this.user) return;

    this.isLoading = true;
    this.userService.updateUser(this.user.id, this.profileForm.value).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.isEditing = false;
        this.isLoading = false;
        this.toastr.success('Profile updated successfully');
        
        if (updatedUser.username !== this.authService.getUsername()) {
          this.authService.setUsername(updatedUser.username);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Profile update error:', err);
        this.toastr.error('Failed to update profile');
      }
    });
  }
}