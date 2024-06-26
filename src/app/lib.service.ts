import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LibService {
  getValueToDateInput(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthValue = month < 10 ? '0' + month : month;
    const day = date.getDate();
    const dayValue = day < 10 ? '0' + day : day;
    const hours = date.getHours();
    const hoursValue = hours < 10 ? '0' + hours : hours;
    const minutes = date.getMinutes();
    const minutesValue = minutes < 10 ? '0' + minutes : minutes;
    return `${year}-${monthValue}-${dayValue}T${hoursValue}:${minutesValue}:00`;
  }
}
