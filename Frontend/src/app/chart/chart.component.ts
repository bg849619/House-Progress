import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartService } from '../service/chart.service';
import { AgCharts } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';
import { map, tap } from 'rxjs';

@Component({
	selector: 'app-chart',
	standalone: true,
	imports: [CommonModule, AgCharts, ],
	templateUrl: './chart.component.html',
	styleUrl: './chart.component.scss'
})
export class ChartComponent implements OnInit {
	
	chartOptions: AgChartOptions;

	constructor(private chartService: ChartService){

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
		this.chartService.get_data().pipe(
			tap(console.log)
		).subscribe((res) => {
			this.chartOptions = {
				...this.chartOptions,
				data: res
			}

		})

	}

	
}
