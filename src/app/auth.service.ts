import { Injectable, OnInit, signal } from '@angular/core';
import { User } from './types/user';
import { ServerService } from './server.service';
import { catchError, map, Observable } from 'rxjs';
import io from 'socket.io-client';
import { ToastrService } from 'ngx-toastr';
import { Order } from './types/order';
import { toast } from 'ngx-sonner';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSignal = signal<User | null>(null);
  orders: Order[] = [];

  constructor(private server: ServerService, private toast: ToastrService) {}

  socket = io(environment.apiUrl);

  isConnected = false;

  openSnackbar(message: string, type = 'info') {
    switch (type) {
      case 'info': {
        //this.toast.info(message);
        toast.info(message);
        break;
      }
      case 'error': {
        //this.toast.error(message);
        toast.error(message);
        break;
      }
    }
  }

  auth() {
    return this.server.auth().subscribe(
      (value) => {
        this.userSignal.set(value.user);
        this.orders = value.user.orders;
        if (this.isConnected) return;
        this.connect();
      },
      catchError((err) => {
        console.log(err.message);
        this.userSignal.set(null);
        return err;
      })
    );
  }

  isAuthenticated() {
    return this.server.auth().pipe(
      map(
        (value) => {
          return !!value.user;
        },
        catchError((err) => {
          this.userSignal.set(null);
          return err;
        })
      )
    );
  }

  logout() {
    return this.server.logout().subscribe(
      (value) => {
        this.userSignal.set(null);
        localStorage.removeItem('accessToken');
      },
      catchError((err) => {
        console.log(err.message);
        return err;
      })
    );
  }

  connect() {
    const id = this.userSignal()?.id;
    if (!id) return;
    this.socket.emit('message', {
      type: 'connection',
      id,
    });
    this.isConnected = true;
    this.socket.on('message', (message) => {
      const msg = JSON.parse(message);
      this.auth();
      console.log(msg);
      if (msg.type === 'message') {
        this.openSnackbar(msg.data);
      }
    });
    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
    });
  }
}
