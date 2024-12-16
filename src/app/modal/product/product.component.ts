import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ProductsModel } from 'src/app/products/products.modal';
import { ProductsService } from 'src/app/service/products.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  productFrom!: FormGroup;
  updateProductData: any;
  pageType: any;
  private unsubscribe$ = new Subject<void>();
  fileToUpload: any;
  imageUrl: any;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private productService: ProductsService,
    private router: Router,
    public dialogRef: MatDialogRef<ProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // First Approach - Getting Data from Mat Dialog Modal
    console.log('dialog user data is... ', this.data);
    this.updateProductData = this.data['productInfo'];
    console.log("updateProductData is... ",this.updateProductData)
    this.pageType = this.data['type'];

    if(this.pageType == "AddProduct") {
            this.productFrom = this.fb.group({
        id: [
          "",
          { validators: [Validators.required, Validators.minLength(4)] },
        ],
        title: [
          "",
          { validators: [Validators.required] },
        ],
        price: [
          "",
          { validators: [Validators.required] },
        ],
        description: [
          "",
          { validators: [Validators.required] },
        ],
        category: [
          "",
          { validators: [Validators.required] },
        ],
        count: [
          "",
          { validators: [Validators.required] },
        ],
        rate: [
          "",
          { validators: [Validators.required] },
        ],
        image: [
          "",
          { validators: [Validators.required] },
        ],
      });
    }

    if(this.pageType == "UpdateProduct" && this.updateProductData) {
      this.productFrom = this.fb.group({
        id: [
          {value: this.updateProductData['id'], disabled: true},
          { validators: [Validators.required, Validators.minLength(2)] },
        ],
        title: [
          this.updateProductData['title'],
          { validators: [Validators.required] },
        ],
        price: [
          this.updateProductData['price'],
          { validators: [Validators.required] },
        ],
        description: [
          this.updateProductData['description'],
          { validators: [Validators.required] },
        ],
        category: [          
          this.updateProductData['category'],
          { validators: [Validators.required] },],
        count: [
          this.updateProductData['rating']['count'],
          { validators: [Validators.required] },
        ],
        rate: [
          this.updateProductData['rating']['rate'],
          { validators: [Validators.required] },
        ],
        image: [
          "",
          { validators: [Validators.required] },
        ],
      });
    }

  }

  ngOnInit(): void {

  }

  updateProduct() {
    this.submitted = true;

    if(this.productFrom.valid) {
      // this.productRawData = this.productFrom.getRawValue();
      this.updateProductData = this.productFrom.getRawValue();
      // this.updateProductData = this.productFrom.value;
      this.updateProductData = Object.assign({...this.updateProductData, image: "https://fakestoreapi.com/img/" + this.updateProductData['image'], rating: {
        rate: this.updateProductData['rate'],
        count: this.updateProductData['count']
      }})
      console.log("update or add product", this.updateProductData)
      let chargeBack$;
      if(this.pageType == "UpdateProduct") {
        chargeBack$ = this.productService
        .updateProduct(this.updateProductData.id, this.updateProductData)
        .subscribe((res) => {
          console.log('resp is... ', res);
          this.toastr.success(
            'Product Updated Successfully!'
          );
        },(error) => {
          this.toastr.error(error['message']);
        });
      } else {
        chargeBack$ = this.productService.createProduct(this.updateProductData)
        .subscribe((res) => {
          console.log('resp is... ', res);
          this.toastr.success(
            'Product Created Successfully!'
          );
        },(error) => {
          this.toastr.error(error['message']);
        });;
      }
      this.dialogRef.close("Successfully created and updated product");
    } else {
      this.toastr.warning('Please enter all form feild values!');
      return;
    }
  }

  closePopup() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  handleFileInput(file:any) {
    console.log("file is...", file.target)

    this.fileToUpload = file.target.files[0];

    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
      console.log("image url is... ", this.imageUrl)
      this.productFrom.patchValue({
        image: this.fileToUpload.name
      });
    }
    reader.readAsDataURL(this.fileToUpload);
    
  }
  
    // convenience getter for easy access to form fields
    get f() {
      return this.productFrom.controls;
    }
}
