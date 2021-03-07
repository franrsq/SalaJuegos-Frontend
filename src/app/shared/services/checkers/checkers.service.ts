import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckersService {

  boardSize: number = 8;

  constructor() { }
}
