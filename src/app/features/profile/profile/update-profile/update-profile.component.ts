import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { ProfileService } from '../../services/profile.service';
import { ProfileSharedService } from '../../../../core/services/profile-shared.service';
import { Profile } from '../../interfaces/profile';


@Component({
  selector: 'app-update-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.css'
})
export class UpdateProfileComponent {
  profileForm: FormGroup;
  loading = signal(false);
  loadingProfile = signal(false);
  selectedFile: File | null = null;
  error = signal(false);
  success = signal(false);
  errorMessage = signal<{ msg: string; path: string }[]>([]);
  profileImgPath: string | null = null; // Initialize with null or a default image path
  private apiUrl = environment.apiUrl;

  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder,
    private profileSharedService: ProfileSharedService
  ){
    this.profileForm = this.fb.group({
      img: [''],
      username: ['', [Validators.minLength(3)]],
      phone: ['', [Validators.pattern(/^\d{10,15}$/)]],
      birthday: [''],
      gender: ['', [Validators.pattern(/^(hombre|mujer|otro|null)$/i)]],
      name: ['', [Validators.minLength(2)]],
      email: ['', [Validators.required,Validators.email]],
    });
  }

  ngOnInit(): void {
    this.loadingProfile.set(true);
    this.profileService.getProfile().subscribe({
      next: (profile: Profile) => {
        this.profileImgPath = this.apiUrl + '/uploads/'+ profile.img;        
        this.profileForm.patchValue({
          img: profile.img,
          username: profile.username,
          phone: profile.phone,
          birthday: profile.birthday,
          gender: profile.gender,
          name: profile.name,
          email: profile.email,
        });
        setTimeout(() => {
          this.loadingProfile.set(false);
        }, 500); 
      },
      error: (error) => {
        console.error('Error fetching profile:', error);
      }
    });
  }

  onUpdateProfile(): void {
    if (this.profileForm.valid) {
      this.loading.set(true);
      this.error.set(false);
      this.success.set(false);
      this.errorMessage.set([]);
      const profileData: Profile = {
        ...this.profileForm.value
      };

      if (this.selectedFile) {
        this.profileService.uploadProfileImage(this.selectedFile).subscribe({
          next: (data: any) => {            
            this.profileImgPath = this.apiUrl + '/uploads/'+ data.filename;
            profileData.img = data.filename; 
            this.updateProfile(profileData);
            this.profileSharedService.setProfileImage(this.profileImgPath);         
          },
          error: (error) => {
            this.loading.set(false);
          }
        });
      } else {
        this.updateProfile(profileData);
      }
    }
  }

  private updateProfile(profileData: Profile): void {
    this.profileService.updateProfile(profileData).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
      },
      error: (error) => {
        this.loading.set(false);
        this.error.set(true);
        const errors = error?.error?.errors || [];
        this.errorMessage.set(errors);
      }
    });
  }
  previewImg: string | ArrayBuffer | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;
  
      this.profileForm.get('img')?.setValue(file.name); // solo para marcarlo como cambiado
      this.profileForm.get('img')?.markAsDirty();
  
      // Si usas preview de imagen:
      const reader = new FileReader();
      reader.onload = () => this.previewImg = reader.result as string;
      reader.readAsDataURL(file);
    }
  }
}
