import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-resetpassword',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.css'
})
export class ResetpasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string | null = null;
  loading = signal(false);
  error = signal(false);
  errorMessage = signal<{ msg: string; path: string }[]>([]);
  success = signal(false);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) { 
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    }, { validators: this.passwordMismatch.bind(this) });
  }

  
  passwordMismatch(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    console.log('token', this.token);
    
  }
  onResetPassword(): void {
    if(!this.resetPasswordForm.invalid && this.token){
      this.loading.set(true);
      const passwordData = this.resetPasswordForm.value;
      this.authService.verifyResetPassword(this.token, passwordData.password).subscribe({
        next: () => {
          this.loading.set(false);
          this.success.set(true);
        },
        error: (error) => {
          const errors = error?.error?.errors || [];
          this.loading.set(false);
          this.errorMessage.set(errors);
          this.error.set(true);
        }
      });
    }
  }
}
