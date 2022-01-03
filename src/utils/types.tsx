export type Coordinates = Array<Array<number>>;
export type ColumnDetails = {
	name: string;
	color: string;
	value: number | null;
};
export type Selectors = {
	rootSelector: string;
	canvasSelector: string;
	tooltipSelector: string;
};
export type TooltipData = {
	title: string | number;
	items: Array<ColumnDetails>;
};
export type ProxyMouse = {
	left: number;
	top: number;
};
export type TooltipFunction = {
	show: (proxyMouse: ProxyMouse, data: TooltipData) => void;
	hide: () => void;
};

export enum FORMAT_TYPES {
	DATE = 'date',
	NUMBER = 'number',
	STRING = 'string',
}
