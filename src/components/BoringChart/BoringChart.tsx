import React from 'react';
import style from './BoringChart.module.css';
import { ChartConstructor } from '../../utils/chartConstructor';
import { ColumnDetails } from '../../utils/types';

interface BoringChartProps {
	columnDetails: ColumnDetails[];
	xData: any;
	yData: any;
	rootSelector?: string;
	canvasSelector?: string;
	tooltipSelector?: string;
}

const BoringChart: React.FC<BoringChartProps> = (props) => {
	const {
		columnDetails,
		xData,
		yData,
		rootSelector = 'root',
		canvasSelector = 'canvas',
		tooltipSelector = '[data-el="tooltip"]',
	} = props;

	React.useEffect(() => {
		const tgChart = new ChartConstructor(columnDetails, xData, yData, {
			rootSelector,
			canvasSelector,
			tooltipSelector,
		});
		tgChart.init();

		return () => tgChart.destroy();
	}, []);

	return (
		<div className={style.card}>
			<div className={style.innerContainer} id="chart">
				<div data-el="tooltip" className={style.tooltip}></div>
				<canvas></canvas>
			</div>
		</div>
	);
};

export { BoringChart };
