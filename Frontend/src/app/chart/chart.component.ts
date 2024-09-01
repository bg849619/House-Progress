import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartService } from '../service/chart.service';
import { AgCharts } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';
import { EMPTY, switchMap, zip } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddDialogComponent, addDialogData } from '../dialog/add-dialog/add-dialog.component';
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
			series: [],
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
		this.updateChartData()
	}

	private updateChartData() {
		zip(
			this.chartService.get_names(),
			this.chartService.get_data()
		).subscribe((res: [string[], JSON[]]) => {
			if (JSON.stringify(this.names) != JSON.stringify(res[0])) {
				this.names = res[0]
				const newSeries: any = this.names.map((name:String) => ({
					type: "line",
					xKey: "date",
					yKey: name,
					yName: name,
				}))
				this.chartOptions = {
					...this.chartOptions,
					series: newSeries,
					data: res[1]
				}
			} else {
				this.chartOptions = {
					...this.chartOptions,
					data: res[1]
				};
			}
		})
	}

	addDataButtonClick() {
		const addData: addDialogData = {
			names: this.names
		}
		this.matDialog.open(AddDialogComponent, {
			data: addData
		}).afterClosed().pipe(
			switchMap((res) => {
				if (res) {
					return this.chartService.add_data(res.name, res.date, res.amount)
				} else {
					return EMPTY
				}
			})
		).subscribe((res: any) => {
			if (res.status === 'success') {
				this.updateChartData()
			}
		})
	}


}
