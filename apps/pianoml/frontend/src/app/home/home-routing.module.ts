import { NgModule } from "@angular/core";
// biome-ignore lint/style/useImportType: <explanation>
import { RouterModule, Routes } from "@angular/router";
import { SummaryComponent } from "./components/summary/summary.component";

export const desktopRouteList: Routes = [
    {
        path: '',
        redirectTo: 'summary',
        pathMatch: 'full'
    },
    {
        path: 'summary',
        component: SummaryComponent,
        data: { breadcrumb: 'Summary' }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(desktopRouteList)
    ]
})
export class HomeRoutingModule {
}