# Boring react chart

### React library for simple boring chart.
<img width="1336" alt="Снимок экрана 2022-01-04 в 16 02 56" src="https://user-images.githubusercontent.com/53794193/148056614-07642c6f-dfdf-4367-8dc1-a297d4d755bb.png">
## Usage

```
npm install boring-react-chart
yarn add boring-react-chart
```
```jsx
import { BoringChart } from 'boring-react-chart';

<BoringChart
	xData={getxData()}
	yData={getyData()}
	columnDetails={getColumnDetails()}
	rootSelector={'root'}
	canvasSelector={'canvas'}
	tooltipSelector={'[data-el="tooltip"]'}
/>;
```

### Expected Props:

- xData: Array<Number | String>

```
[1542412800000, 1542499200000, 1542585600000, 1542672000000, 1542758400000]
```

- yData: Array<Array<Number | String>> or Array<Number | String>

```
[
	[37, 20, 32, 39, 32],
	[1, 12, 30, 40, 33, 23]
]
```

- columnDetails: Array<{name: String, color: String, value: string | number | null }>

```
[
	{ name: 'Time', color: 'pink', value: null },
	{ name: 'Money', color: 'green', value: null },
];
```

- You can also specify selectors for root, canvas and tooltip html-elements

```
	rootSelector={'root'}
	canvasSelector={'canvas'}
	tooltipSelector={'[data-el="tooltip"]'}
```
