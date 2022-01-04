import {
	WIDTH,
	HEIGHT,
	DPI_WIDTH,
	DPI_HEIGHT,
	ROWS_COUNT,
	PADDING,
	VIEW_HEIGHT,
	VIEW_WIDTH,
	COLS_COUNT,
} from './constants';
import {
	isMouseOver,
	line,
	circle,
	computeBoundaries,
	toCoordinates,
	formatLabel,
} from './helpers';
import {
	ColumnDetails,
	Selectors,
	FORMAT_TYPES,
	TooltipFunction,
} from './types';
import { getTooltip } from './tooltip';

export class ChartConstructor {
	root: HTMLElement;
	canvas: HTMLCanvasElement;
	context: CanvasRenderingContext2D;
	tooltip: TooltipFunction;
	columnDetails: ColumnDetails[];
	xData: Array<number>;
	yData: Array<Array<number>>;
	raf: number | null;
	proxy: any;

	constructor(
		columnDetails: ColumnDetails[],
		xData: number[],
		yData: Array<Array<number>>,
		selectors: Selectors
	) {
		this.root = document.getElementById(selectors.rootSelector)!;
		this.canvas = this.root.querySelector(selectors.canvasSelector)!;
		this.context = this.canvas.getContext('2d')!;
		this.tooltip = getTooltip(
			this.root.querySelector(selectors.tooltipSelector)!
		);
		this.columnDetails = columnDetails;
		this.xData = xData;
		this.yData = yData;
		this.raf = null;
		this.proxy = new Proxy(
			{},
			{
				set(...args) {
					const [, , mouse] = args;
					const result = Reflect.set(...args);
					if (mouse) {
						mouse.raf = requestAnimationFrame(mouse.callback);
					}
					return result;
				},
			}
		);
		this.canvas.style.width = WIDTH + 'px';
		this.canvas.style.height = HEIGHT + 'px';
		this.canvas.width = DPI_WIDTH;
		this.canvas.height = DPI_HEIGHT;
		this.canvas.addEventListener('mousemove', this.mousemove);
		this.canvas.addEventListener('mouseleave', this.mouseleave);
	}

	mousemove = ({ clientX, clientY }: MouseEvent) => {
		const { left, top } = this.canvas.getBoundingClientRect();
		this.proxy.mouse = {
			x: (clientX - left) * 2,
			tooltip: {
				left: clientX - left,
				top: clientY - top,
			},
			callback: this.paint,
			raf: this.raf,
		};
	};

	mouseleave = () => {
		cancelAnimationFrame(this.proxy.mouse.raf);
		this.proxy.mouse = null;
		this.tooltip.hide();
	};

	clear = () => {
		this.context.clearRect(0, 0, DPI_WIDTH, DPI_HEIGHT);
	};

	paint = () => {
		this.clear();

		const [yMin, yMax] = computeBoundaries(this.yData);
		const yRatio = VIEW_HEIGHT / (yMax - yMin);
		const xRatio = VIEW_WIDTH / (this.xData.length - 2);

		this.yAxis(yMin, yMax);
		this.xAxis(this.xData, this.yData, xRatio);

		this.yData.forEach((col, index) => {
			const coordinates = col.map(toCoordinates(xRatio, yRatio));
			const color = this.columnDetails[index].color;

			line(this.context, coordinates, color);

			for (const [x, y] of coordinates) {
				if (isMouseOver(this.proxy.mouse, x, coordinates.length)) {
					circle(this.context, x, y, color);
					this.context.beginPath();
					this.context.lineWidth = 2;
					this.context.strokeStyle = this.columnDetails[index].color;
					this.context.moveTo(0, y);
					this.context.lineTo(DPI_WIDTH, y);
					this.context.stroke();
					this.context.closePath();
					break;
				}
			}
		});
	};

	yAxis = (yMin: number, yMax: number) => {
		const step = VIEW_HEIGHT / ROWS_COUNT;
		const textStep = (yMax - yMin) / ROWS_COUNT;

		this.context.beginPath();
		this.context.lineWidth = 0.2;
		this.context.strokeStyle = '#bbb';
		for (let i = 1; i <= ROWS_COUNT; i++) {
			const y = step * i;
			const text = Math.round(yMax - textStep * i);
			this.context.fillText(text.toString(), 5, y + PADDING - 15);
			this.context.moveTo(0, y + PADDING - 10);
			this.context.lineTo(DPI_WIDTH, y + PADDING - 10);
		}
		this.context.stroke();
		this.context.closePath();
	};

	xAxis = (
		xData: Array<number>,
		yData: Array<Array<number>>,
		xRatio: number
	) => {
		const step = Math.round(xData.length / COLS_COUNT);

		this.context.beginPath();

		for (let i = 1; i < xData.length; i++) {
			const x = i * xRatio;
			if ((i - 1) % step === 0) {
				const text = formatLabel(xData[i], FORMAT_TYPES.DATE);
				if (text) {
					this.context.fillText(text.toString(), x, DPI_HEIGHT - 5);
				}
			}
			if (isMouseOver(this.proxy.mouse, x, xData.length)) {
				this.context.save();
				this.context.moveTo(x, PADDING / 2);
				this.context.lineTo(x, DPI_HEIGHT - PADDING);

				this.context.restore();
				this.tooltip.show(this.proxy.mouse.tooltip, {
					title: formatLabel(xData[i], FORMAT_TYPES.DATE),
					items: yData.map((col, index) => ({
						color: this.columnDetails[index].color,
						name: this.columnDetails[index].name,
						value: col[i + 1],
					})),
				});
			}
		}

		this.context.stroke();
		this.context.closePath();
	};

	init = () => {
		this.paint();
	};

	destroy = () => {
		if (this.raf) {
			cancelAnimationFrame(this.raf);
		}
		this.canvas.removeEventListener('mousemove', this.mousemove);
		this.canvas.removeEventListener('mouseleave', this.mouseleave);
	};
}
