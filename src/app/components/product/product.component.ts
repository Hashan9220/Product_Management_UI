import { AsyncPipe } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Product } from '../../models/product.model';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [RouterOutlet,AsyncPipe, HttpClientModule,FormsModule,ReactiveFormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  http = inject(HttpClient);
   IsUpdate = false 
  itemId = 0;
  productForm = new FormGroup({
    productCode: new FormControl<string>(''),
  productName: new FormControl<string>(''),
  productCategory: new FormControl<string>(''),
  productQTY: new FormControl<number>(0)
  })
  product$ = this.getProduct();

  onFormSubmit () {
 if (this.IsUpdate==false) {
  const addProductRequest = {
    productCode: this.productForm.value.productCode,
    productName: this.productForm.value.productName,
    productCategory: this.productForm.value.productCategory,
    productQTY: this.productForm.value.productQTY
  }
  
  this.http.post('https://localhost:7255/api/Product',addProductRequest)
  .subscribe({
    next:(value) => {
      this.product$ = this.getProduct();
      this.productForm.reset();
    }
  })
 } else {
  console.log(this.itemId);
  
  const updateProductRequest = {
    productCode: this.productForm.value.productCode,
    productName: this.productForm.value.productName,
    productCategory: this.productForm.value.productCategory,
    productQTY: this.productForm.value.productQTY
  }
  console.log('0000000 ', updateProductRequest);
  
  this.http.put(`https://localhost:7255/api/Product/${this.itemId}`,updateProductRequest)
  .subscribe({
    next:(value) => {
      this.product$ = this.getProduct();
      alert('Product Update successfully')
      this.IsUpdate = false 
      this.itemId = 0;
      this.productForm.reset();
    }
  })
 }
  }
  onUpdate(item: Product){
    this.IsUpdate = true

    this.itemId = item.id; 
    this.productForm.patchValue(item);
  }

  onDelete(id:number){
    this.http.delete(`https://localhost:7255/api/Product/${id}`)
    .subscribe({
      next:(value) => {
        alert('Product deleted successfully')
        this.product$ = this.getProduct();
      }
    })
  }
  // product$ = this.getProduct().pipe(
  //   tap(data => console.log('Product data:', data))
  // );
  
  private getProduct():Observable<Product[]> {
   return this.http.get<Product[]>('https://localhost:7255/api/Product')
  }
}
