import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartService } from '../service/chart.service';
import { AgCharts } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';
import { EMPTY, map, switchMap, tap, zip } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddDialogComponent, addDialogData } from '../add-dialog/add-dialog.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-chart',
	standalone: true,
	imports: [CommonModule, AgCharts, MatButtonModule],
	templateUrl: './chart.component.html',
	styleUrl: './chart.component.scss'
})
export class ChartComponent implements OnInit {

	chartOptions: AgChartOptions;
	names: string[];

	constructor(private chartService: ChartService, private matDialog: MatDialog) {

		this.names = []

		this.chartOptions = {
			data: [],
			title: {
				text: "6B Elliot Gambling Winnings",
			},
			footnote: {
				text: "Source: Your mom",
			},
			series: [
				{
					type: "line",
					xKey: "date",
					yKey: "Chance",
					yName: "Chance",
				},
				{
					type: "line",
					xKey: "date",
					yKey: "Cody",
					yName: "Cody",
				},
				{
					type: "line",
					xKey: "date",
					yKey: "Kaleb",
					yName: "Kaleb",
				},
				{
					type: "line",
					xKey: "date",
					yKey: "Nick",
					yName: "Nick",
				},
				{
					type: "line",
					xKey: "date",
					yKey: "Sam",
					yName: "Sam",
				}
			],
			axes: [
				{
					type: "category",
					position: "bottom",
					title: {
						text: "Date",
					},
				},
				{
					type: "number",
					position: "left",
					title: {
						text: "Money $",
					},
				},
			],
		};
	}

	ngOnInit(): void {
		zip(
			this.chartService.get_names(),
			this.chartService.get_data()
		).subscribe((res: [string[], any]) => {
			this.names = res[0],
			this.updateChartData(res[1])
		})
	}

	private updateChartData(newData: any[]) { 
		return this.chartOptions = {
			...this.chartOptions,
			data: newData
		};
	}

	addDataButtonClick() {
		const addData: addDialogData = {
			names: this.names
		}
		this.matDialog.open(AddDialogComponent, {
			data: addData
		}).afterClosed().pipe(
			switchMap((res) => {
				if(res){
					return this.chartService.add_data(res.name, res.date, res.amount)
				}else{
					return EMPTY
				}
			}),
			switchMap((res: any) => {
				if(res.status === 'success'){
					return this.chartService.get_data()
				}else{
					return EMPTY
				}
			}),
			).subscribe((res:any) => {
				this.updateChartData(res)
			})
	}


}
