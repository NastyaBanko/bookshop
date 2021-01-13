import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { User } from '../../user';
import { UserService } from '../../user.service';
import {Router} from '@angular/router';
import { HttpClient} from '@angular/common/http';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  savedUsers: User[];
  userPassword: string;
  loginError: string = "";

  userEmail = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();

  currentCategories: any;

  constructor(private userService: UserService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    // this.http.get('/api/v1/categories').subscribe((data:any) => this.currentCategories=data);
    // console.log("loggggiiin")
    setTimeout(()=>{
      this.getSavedUsers();
    }, 1000)
  }

  getSavedUsers(): void {
    this.userService.getSavedUsers()
        .subscribe(savedUsers => this.savedUsers = savedUsers);
  }

  updateUser(user): void {
    this.userService.updateUser(user).subscribe(()=>{console.log("update")})
  }

  createAccount(): void {
    console.log(this.savedUsers, "))))")
    this.router.navigate(['createAccount']);
  }

  addToLocaleStorage(user): void {
    let currentUser = {
      id: user.id,
      userName: user.userName,
      type: user.type,
      email: user.email,
      password: user.password,
      isLogin: true,
    }
    let serialObj = JSON.stringify(currentUser);
    localStorage.setItem("currentUser", serialObj);
  }

  submit(): void {
    console.log(this.savedUsers, ">>>>")
    let isSaved = this.savedUsers.find(el=>el.email===this.userEmail.value&&el.password===this.userPassword)
    console.log(isSaved, "login")
    if(isSaved){

      this.loginError = "";

      const updateUser = {...isSaved};
      updateUser.isLogin = true;

      if(isSaved.type === "admin"){
        this.router.navigate(['admin']);
      } else this.router.navigate(['user']);
      this.addToLocaleStorage(isSaved)
      this.userService.login(isSaved.type, isSaved.userName, isSaved.email, isSaved.password);
      this.updateUser(updateUser);
      this.getSavedUsers();
    } else {
      this.loginError = "Incorrect username or password.";
      this.userService.logout();
    }
  }

}
