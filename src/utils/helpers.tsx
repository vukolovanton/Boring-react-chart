import { DPI_WIDTH, DPI_HEIGHT, PADDING, CIRCLE_RADIUS } from './constants';

import { Coordinates, FORMAT_TYPES } from './types';

export function isMouseOver(mouse: any, x: number, length: number) {
	if (!mouse) return false;

	const width = DPI_WIDTH / length;
	return Math.abs(x - mouse.x) < width / 2;
}

export function line(
	context: CanvasRenderingContext2D,
	coordinates: Coordinates,
	color: string
) {
	context.beginPath();
	context.lineWidth = 5;
	context.strokeStyle = color;
	for (const [x, y] of coordinates) {
		context.lineTo(x, y);
	}
	context.stroke();
	context.closePath();
}

export function circle(
	context: CanvasRenderingContext2D,
	x: number,
	y: number,
	color: string
) {
	context.beginPath();
	context.strokeStyle = color;
	// context.fillStyle = '#fff';
	context.lineWidth = 4;
	context.arc(x, y, CIRCLE_RADIUS, 0, Math.PI * 2);
	context.fill();
	context.stroke();
	context.closePath();
}

export function computeBoundaries(
	columns: Array<Array<number>>
): Array<number> {
	let min: number = 0;
	let max: number = 0;

	columns.forEach((col) => {
		if (typeof min !== 'number') min = col[0];
		if (typeof max !== 'number') max = col[0];
		if (min > col[0]) min = col[0];
		if (max < col[0]) max = col[0];

		for (let i = 1; i < col.length; i++) {
			if (min > col[i]) min = col[i];
			if (max < col[i]) max = col[i];
		}
	});

	return [min, max];
}

export function toCoordinates(
	xRatio: number,
	yRatio: number
): (y: number, i: number) => number[] {
	return (y, i) => [
		Math.round((i - 1) * xRatio),
		Math.round(DPI_HEIGHT - PADDING - y * yRatio),
	];
}

export function css(el: HTMLElement, styles = {}) {
	Object.assign(el.style, styles);
}

export function formatLabel(value: string | number, type: FORMAT_TYPES) {
	if (type === FORMAT_TYPES.DATE) {
		return new Date(value).toLocaleDateString('en-GB');
	} else return value;
}
