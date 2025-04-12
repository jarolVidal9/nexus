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
  error = signal(false);
  loading = signal(false);
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
}
