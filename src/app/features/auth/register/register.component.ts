import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RegisterInterface } from '../interfaces/register.interface';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerForm: FormGroup;
  error = signal(false);
  errorsMessage = signal<{ msg: string, path: string }[]>([]);
  loading = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    },
    {
      validators: this.passwordMismatch.bind(this)
    }
    );
  }


  onRegister(): void {
    if(!this.registerForm.invalid) {
      console.log('Register form submitted');
      this.loading.set(true);
      const dataRegister: RegisterInterface = this.registerForm.value;
      this.authService.register(dataRegister).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.loading.set(false);
          this.error.set(true);
          this.errorsMessage.set(error?.error?.errors || []);
        }
      });
    }
  }

  passwordMismatch(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
