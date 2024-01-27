import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/authlayout.component'//./components/authpage.component';
import { AuthedComponent as AuthedComponent } from './components/auth/authedlayout.component'//./components/authpage.component';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/signup/signup.component';
import { UserlistComponent } from './pages/userlist/userlist.component';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',     
               //<---- Auth page
        component: AuthComponent,
        children: [
            {
                path: 'login',
                component: LoginComponent  // <-- Login component 
            },
            {
                path: 'signup',
                component: SignUpComponent  // <-- SignUp component 
            },
        ]
    },
    {
        path: 'user-list',
        component: AuthedComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'user-list',
                component: UserlistComponent,
                canActivate: [AuthGuard],  // <-- Login component 
            }
        ]
    },
    { path: '', redirectTo: '/auth/signup', pathMatch: 'full' },
];
