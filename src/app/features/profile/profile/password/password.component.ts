import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent {
  passwordForm: FormGroup;
  loading = signal(false);
  error = signal(false);
  success = signal(false);
  errorMessage = signal<{ msg: string; path: string }[]>([]);


  constructor(private fb: FormBuilder,
    private profileService: ProfileService
  ) {
    this.passwordForm = this.fb.group(
      {
        password: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMismatch.bind(this) }
    );
  }

  passwordMismatch(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  onChangePassword() {
    if (this.passwordForm.invalid) return;
    this.error.set(false);
    this.success.set(false);
    this.loading.set(true);
    this.profileService.updatePassword(this.passwordForm.value).subscribe({
      next: () => {
        this.passwordForm.reset();
        this.success.set(true);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(true);
        this.errorMessage.set(error.error.errors);
        this.passwordForm.setErrors({ passwordMismatch: true });
        this.loading.set(false);
      }
    });
  }

}
