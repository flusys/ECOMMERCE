import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {

  constructor() { }

  createParentProduct(data:any) :any{
    return 'Parent Product Created';
  }
  getParentProductById(id:number) :any{    
    return 'Parent Product';
  }
}
