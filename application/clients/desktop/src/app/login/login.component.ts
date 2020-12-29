import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from './loginservice.service';
import { AuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angular-6-social-login';
import { Brodcastservice } from '../broadcast.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public errorMessage: String;
  public isErrorMessage: Boolean;
  // tslint:disable-next-line:max-line-length
  constructor(private route: Router, private router: ActivatedRoute, private loginservice: LoginService, private authservice: AuthService, public broadcast: Brodcastservice, private formBuilder: FormBuilder, ) {
    this.show = false;
  }

  public challenge: any;
  public loginchallenge: any;
  public login: any;
  public loginform: FormGroup;
  public user = {
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  };
  submitted = false;
  new_user = false;
  public borderStyle: any = {
    email: '#ced4da',
    password: '#ced4da',
  };
  public token: any;
  public isSingePageSignIn: boolean;
  public href: any;
  public lastloggedintime: any;
  public userdetails: any;
  public errormessage: any;
  public id: any;
  public Userdetails: any;
  public tokenerror: any;
  public Accesslevel: any;
  public permission: any[] = [];
  public signup: boolean;
  public newUser: any = [];
  public isChecked: boolean;
  displayModel: String = 'none';
  public show: boolean;
  public openId: String = 'openid';


  ngOnInit() {
    // this.Queryparams();
    // this.authservice.authState.subscribe((user) => {
    //   this.googleuser = user;
    //   this.loggedIn = (user != null);
    // });
    this.loginform = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    });
    this.loginform.valueChanges.subscribe(() => {
      this.submitted = false;
      this.errorMessage = '';
      this.isErrorMessage = false;
      this.borderStyle.email = '#ced4da';
    });
  }

  get f() { return this.loginform.controls; }


  closeDeleteFModel() {
    this.displayModel = 'none';
    this.isChecked = false;
  }

  signInwithGoogle() {
    this.authservice.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  newuser(value) {
    const invalid = this.loginform;
    this.new_user = true;
    console.log("invalid -------------------++++++++++", this.loginform.value.email, 'ddsdsd', this.loginform.value.password)
    if (this.loginform.value.email !== '' && this.loginform.value.password !== '') {
      this.new_user = false;
      console.log("murugan")
      if (value.checked) {
        this.signup = true;
        this.displayModel = 'block';
        this.isChecked = true;

      }
    }

  }


  Queryparams() {
    this.router.queryParams.subscribe(params => {
      this.loginchallenge = params['login_challenge'];
      this.challenge = window.location.href;
      this.login = {
        'login_challenge': this.challenge
      };
      const splitvalue = this.challenge.split('?');
      this.login = splitvalue[1];
      // this.loginservice.Getlogin(this.login).subscribe(token => {
      //   this.token = token.csrftoken;
      // }, error => {
      //   console.error('error: ', error);
      // });
    });
  }


  newUserLogin() {
    this.loginservice.signup(this.user).subscribe(data => {
      this.Userdetails = data.Userdetails;
      console.log('userinfoo--->', this.Userdetails);
      this.displayModel = 'none';
      this.isChecked = false;
      this.user.firstName = '';
      this.user.lastName = '';
      if (this.Userdetails.body === 'Email is already exists') {
        console.log('-----------error message-------');
        this.errormessage = this.Userdetails.body;
      } else {
        if (this.Userdetails.body.Idtoken === null || this.Userdetails.body.Idtoken === '' || this.Userdetails.body.Idtoken === undefined) {
          this.Consent();
          // this.route.navigate(['consent'], { queryParams: { id: this.Userdetails.body._id } });
        }

      }
    });
  }
  hideEye() {
    this.show = !this.show;
  }

  onChange(event) {
    if (event === true ) {
      this.isSingePageSignIn = true;
    }
    if (event === false) {
      this.isSingePageSignIn = false;
    }
    console.log('event-->>', event);

  }


  Login() {
    const { invalid, value } = this.loginform;
    this.submitted = true;
    if (invalid) {
      return;
    }
    this.permission = [];
    this.loginservice.Login(this.user).subscribe(logindetails => {
      if (logindetails.Access !== undefined) {
        console.log('-------ahdbakjvjakjak--------');
        this.Accesslevel = logindetails.Access[0];
        this.permission.push(this.Accesslevel);
        this.broadcast.sendmessage({ 'Access': this.permission });
        this.broadcast.gaurdarray = [];
        this.broadcast.gaurdarray = this.permission;
        console.log('------------loginresponse-----', this.permission);
        // sessionStorage.setItem('Access', JSON.stringify(this.permission));
      }
      this.Userdetails = logindetails.Userdetails;
      this.tokenerror = logindetails.error;
      this.id = this.Userdetails.body._id;
      this.lastloggedintime = this.Userdetails.body.loggedinDate;
      // const redirecturi = logindetails.redirectUrl;
      // window.open(redirecturi, '_self');
      if (this.Userdetails.body === 'Incorrect Username or Password') {
        this.errormessage = this.Userdetails.body;
      } else {
        if (this.tokenerror !== undefined) {
          console.log('-------insideifconditioin-----');
          if (this.tokenerror.name === 'TokenExpiredError') {
            this.Consent();
          }
        } else {
          sessionStorage.setItem('Id', this.id);
          sessionStorage.setItem('lastloggedintime', this.lastloggedintime);
          sessionStorage.setItem('email', this.Userdetails.body.email);
          sessionStorage.setItem('JwtToken', this.Userdetails.body.Idtoken);
          if (this.Userdetails.body.Idtoken === null || this.Userdetails.body.Idtoken === '') {
            this.Consent();
          } else {
            console.log('projecttt--#############################->>>')
            this.route.navigate(['project']);
          }

        }
      }

    }, error => {
      console.error('error---------->>>>>', error);
    });

  }

  googlesigin(socialPlatform: string) {
    console.log('google');
    let socialPlatformProvider;
    if (socialPlatform === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    this.authservice.signIn(socialPlatformProvider).then((userdata => {
      console.log(' sign in data : ', userdata);
      const googleobject = {
        'email': userdata.email,
        'idtoken': userdata.idToken,
        'name': userdata.name,
        'provider': userdata.provider,
        'token': userdata.token,
      };
      this.loginservice.googlelogin(googleobject).subscribe(googleresponse => {
        console.log('sign in data : ', googleresponse);
        this.Userdetails = googleresponse.Userdetails;
        this.id = this.Userdetails.body._id;
        this.lastloggedintime = this.Userdetails.body.loggedinDate;
        if (googleresponse.Access !== undefined) {
          console.log('-------ahdbakjvjakjak--------');
          this.Accesslevel = googleresponse.Access[0];
          this.permission.push(this.Accesslevel);
          this.broadcast.sendmessage({ 'Access': this.permission });
          this.broadcast.gaurdarray = [];
          this.broadcast.gaurdarray = this.permission;
          console.log('------------googleloginresponse-----', this.permission);
          sessionStorage.setItem('Access', JSON.stringify(this.permission));
        }
        sessionStorage.setItem('Id', this.id);
        sessionStorage.setItem('lastloggedintime', this.lastloggedintime);
        sessionStorage.setItem('email', this.Userdetails.body.email);
        sessionStorage.setItem('JwtToken', this.Userdetails.body.Idtoken);
        this.route.navigate(['project']);
      }, error => {
        console.error('error:', error);
      });
    }));

  }

  facebooksigin(socialPlatform: string) {
    let facebookPlatformProvider;
    if (socialPlatform === 'facebook') {
      facebookPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    this.authservice.signIn(socialPlatform).then(fbUserData => {
      console.log('fbuser----ahhaaa-->>', fbUserData);
        const fbUserWithEmail = {
          fbId: fbUserData.id,
          email: fbUserData.email,
          name: fbUserData.name,
          provider: fbUserData.provider,
          token: fbUserData.token,
        };
        this.loginservice.fbLogIn(fbUserWithEmail).subscribe(FbResponse => {
          console.log('fb response --->>', FbResponse);
          if (FbResponse.Access !== undefined) {
            console.log('-------ahdbakjvjakjak--------');
            this.Accesslevel = FbResponse.Access[0];
            this.permission.push(this.Accesslevel);
            this.broadcast.sendmessage({ 'Access': this.permission });
            this.broadcast.gaurdarray = [];
            this.broadcast.gaurdarray = this.permission;
            console.log('------------googleloginresponse-----', this.permission);
            sessionStorage.setItem('Access', JSON.stringify(this.permission));
          }
          sessionStorage.setItem('Id', FbResponse.Userdetails.body._id);
          sessionStorage.setItem('lastloggedintime', FbResponse.Userdetails.body.loggedinDate);
          sessionStorage.setItem('email', FbResponse.Userdetails.body.email);
          sessionStorage.setItem('JwtToken', FbResponse.Userdetails.body.Idtoken);
          this.route.navigate(['project']);
        }, error => {
          console.error('error:', error);
        });
        // });
    });

  }

  Consent() {
    const consentbody = {
      submit: 'Allow access',
      scope: this.openId,
      id: this.id,
    };
    this.loginservice.Consent(consentbody).subscribe(consentvalue => {
      // window.open(consentvalue.redirectUrl, '_self');
      if (consentvalue.Access !== undefined) {
        console.log('-------ahdbakjvjakjak--------');
        this.Accesslevel = consentvalue.Access[0];
        this.permission.push(this.Accesslevel);
        console.log('------------loginresponse-----', this.permission);
        this.broadcast.sendmessage({ 'Access': this.permission });
        // sessionStorage.setItem('Access', JSON.stringify(this.permission));
      }
      this.Userdetails = consentvalue.Userdetails;
      this.id = this.Userdetails.body._id;
      this.lastloggedintime = this.Userdetails.body.loggedinDate;
      this.route.navigate(['project']);
      console.log('--------idtoken------>>>', this.Userdetails);
      sessionStorage.setItem('Id', this.id);
      sessionStorage.setItem('lastloggedintime', this.lastloggedintime);
      sessionStorage.setItem('email', this.Userdetails.body.email);
      sessionStorage.setItem('JwtToken', this.Userdetails.body.Idtoken);
    }, error => {
      console.error('error: ', error);
    });
  }
}
