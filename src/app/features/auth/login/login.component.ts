import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginInterface } from '../interfaces/login.interface';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule],
  standalone: true,
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  resetPasswordForm: FormGroup;
  error = signal(false);
  loading = signal(false);
  loadingReset = signal(false);
  resetSent = signal(false);
  errorReset = signal(false);
  errorMessageReset = signal<{ msg: string; path: string }[]>([]);
  errorsMessage = signal<{ msg: string; path: string }[]>([]);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onLogin(): void {   
    if (!this.loginForm.invalid) {
      this.loading.set(true);
      const loginData: LoginInterface = this.loginForm.value;
      this.authService.login(loginData).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.loading.set(false);
          this.error.set(true);
          const errors = error?.error?.errors || [];
          this.errorsMessage.set(errors);

        },
      });
    }
  }
  onResetPassword(): void {
    if(!this.resetPasswordForm.invalid){
      this.loadingReset.set(true);
      const email = this.resetPasswordForm.value.email;
      this.authService.resetPassword(email).subscribe({
        next: () => {
          this.resetSent.set(true);
          this.loadingReset.set(false);
        },
        error: (error) => {
          this.loadingReset.set(false);
          this.errorReset.set(true);
          const errorReset = error?.error?.errors || [];
          console.log('errorReset', errorReset);
          
          this.errorMessageReset.set(errorReset);
        },
      });
    }
  }
  clearForm(): void {
    this.resetPasswordForm.reset();
    this.resetSent.set(false);
    this.errorReset.set(false);
    this.errorMessageReset.set([]);
  }
}
