import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from '../service/products.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, takeUntil } from 'rxjs';
import { ProductsModel } from './products.modal';
import { MatDialog } from '@angular/material/dialog';
import { ProductComponent } from '../modal/product/product.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  productData: ProductsModel[] = [];

  displayedColumns: string[] = [
    'id',
    'title',
    'price',
    'description',
    'category',
    'image',
    'rating',
    'action',
  ];
  dataSource = new MatTableDataSource<ProductsModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private dialogRef: any;
  private unsubscribe$ = new Subject<void>();

  constructor(private productsService:ProductsService, public dialog: MatDialog, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getAllProductsDetails()
  }

  getAllProductsDetails() {
    this.productsService.getAllProductsList().subscribe((res: any) => {
      this.productData = res;
      
      this.dataSource = new MatTableDataSource(this.productData);
      console.log("dataSource is... ", this.dataSource)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },(error) => {
      this.toastr.error(error['message']);
    })
  }

  addProduct() {
    let widthPercetage = '';
    let data: any = {};
    data.type = 'AddProduct';
    this.openDialog(data, widthPercetage);
  }
  
  updateProduct(productInfo: any) {
    let widthPercetage = '';
    let data: any = {};
    data.type = 'UpdateProduct';
    data.productInfo = productInfo;
    data.id = productInfo.id;
    this.openDialog(data, widthPercetage);
  }

  public openDialog(data: any, widthPercetage: any): void {
    let width = '50%';
    if (widthPercetage) {
      width = widthPercetage + '%';
    }
    if (!this.dialogRef) {
      this.dialogRef = this.dialog.open(ProductComponent, {
        width: "450px",
        panelClass: 'ws-user-custom-info-dialog',
        data: data,
        disableClose: true,
      });
    }
    this.dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result: any) => {
        console.log("result is... ", result)
        this.dialogRef = false;
        if(result == "Successfully created and updated product") {
          this.getAllProductsDetails()
        }
      });
  }

  deleteProduct(element:  any) {
    if(element?.id) {
      this.productsService.deleteProduct(element?.id).subscribe((res) => {
        console.log("customer deleted res is... ", res)
        this.getAllProductsDetails();
        this.toastr.success("Product deleted successfully!")
      },(error) => {
        this.toastr.error(error['message']);
      })
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
