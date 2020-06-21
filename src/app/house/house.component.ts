import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  HouseService
} from '../house.service';
import { httpBuildQuery } from '../http-build-query';
import { tap } from 'rxjs/operators';
import { getLastPageFromHeader } from '../utils';

@Component({
  selector: 'app-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.css']
})
export class HouseComponent implements OnInit, OnDestroy {
  errormsg: boolean = false;
  public allHouses;
  houseComponent: any;

  page = 1;
  pageSize = 5;
  totalPage = 0;

  constructor(public houseService: HouseService) {
    console.log('house component constructor is called');
  }

  ngOnInit() {
    console.log('house component onInite is called');
    this.loadData();
  }

  ngOnDestroy() {
    console.log('housecomponent destroyed');
  }

  loadData() {
    this.houseService.getallHouses(httpBuildQuery({page : this.page , pageSize : this.pageSize}))
      .pipe(
        tap((resp) => {
          this.totalPage = getLastPageFromHeader(resp) * this.pageSize;
        })
      )
      .subscribe((res) => {
        this.allHouses = res.body;
        this.allHouses.map(item => {
          item.id = item.url.split('/').pop();
        });
      });
      error => {
        this.errormsg = true;
        console.log(this.errormsg);
        console.log(error.errorMessage);
        alert(error.errorMessage);
  
        if (error.errorMessage === undefined) {
          alert('Invalid Search');
        }
        this.errormsg = false;
      }
    console.log(this.allHouses);
  }

  pageChanged(event) {
    this.page = event;
    this.loadData();
  }
}
