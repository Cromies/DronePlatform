import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BreadCrumb } from './breadcrumb';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None
})
export class BreadcrumbComponent implements OnInit{
  public breadcrumbs: any;

    // Build your breadcrumb starting with the root route of your current activated route
    constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    let breadcrumbs$ = this.router.events
        .filter(event => event instanceof NavigationEnd)
        .distinctUntilChanged()
        .map(event => this.buildBreadCrumb(this.activatedRoute.root))
        .subscribe((data) => {
          this.breadcrumbs = data;
        });

    }

    ngOnInit() {
      this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
    }


    buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: Array<BreadCrumb> = []): Array<BreadCrumb> {

        // If no routeConfig is avalailable we are on the root path
        const label = route.routeConfig ? route.routeConfig.data[ 'breadcrumb' ] : 'Home';
        const path = route.routeConfig ? route.routeConfig.path : '';
        console.log(label);
        // In the routeConfig the complete path is not available,
        // so we rebuild it each time
        const nextUrl = `${url}${path}/`;
        const breadcrumb = {
            label: label,
            url: nextUrl
        };
        const newBreadcrumbs = [ ...breadcrumbs, breadcrumb ];
        if (route.firstChild) {
            // If we are not on our current path yet,
            // there will be more children to look after, to build our breadcumb
            return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
        }
        return newBreadcrumbs;
    }
}
