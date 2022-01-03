'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".BoringChart-module_card__Zho1z {\n\tdisplay: flex;\n\tjustify-content: center;\n\tborder-radius: 4px;\n\tbackground: #fff;\n\tpadding: 1rem;\n\tbox-shadow: 2px 3px 10px rgba(0, 0, 0, 0.2);\n}\n.BoringChart-module_innerContainer__q--Fq {\n\tposition: relative;\n}\n.BoringChart-module_innerContainer__q--Fq > canvas {\n\tz-index: 2;\n}\n.BoringChart-module_tooltip__suKE3 {\n\tposition: absolute;\n\tdisplay: none;\n\tmax-width: 200px;\n\tmin-width: 120px;\n\tpadding: 0.5rem;\n\tborder-radius: 5px;\n\tbox-shadow: rgba(50, 50, 93, 0.25) 0px 5px 10px -2px,\n\t\trgba(0, 0, 0, 0.3) 0px 3px 6px -3px;\n\tbackground: #000;\n\topacity: 0.8;\n\tcolor: #fff;\n\toverflow: hidden;\n\tz-index: 3;\n\ttop: 50px;\n\tleft: 100px;\n}\n";
var style = {"card":"BoringChart-module_card__Zho1z","innerContainer":"BoringChart-module_innerContainer__q--Fq","tooltip":"BoringChart-module_tooltip__suKE3"};
styleInject(css_248z);

const WIDTH = 600;
const HEIGHT = 200;
const DPI_WIDTH = WIDTH * 2;
const DPI_HEIGHT = HEIGHT * 2;
const ROWS_COUNT = 5;
const PADDING = 40;
const VIEW_HEIGHT = DPI_HEIGHT - PADDING * 2;
const VIEW_WIDTH = DPI_WIDTH;
const COLS_COUNT = 6;
const CIRCLE_RADIUS = 10;

var FORMAT_TYPES;
(function (FORMAT_TYPES) {
    FORMAT_TYPES["DATE"] = "date";
    FORMAT_TYPES["NUMBER"] = "number";
    FORMAT_TYPES["STRING"] = "string";
})(FORMAT_TYPES || (FORMAT_TYPES = {}));

function isMouseOver(mouse, x, length) {
    if (!mouse)
        return false;
    const width = DPI_WIDTH / length;
    return Math.abs(x - mouse.x) < width / 2;
}
function line(context, coordinates, color) {
    context.beginPath();
    context.lineWidth = 5;
    context.strokeStyle = color;
    for (const [x, y] of coordinates) {
        context.lineTo(x, y);
    }
    context.stroke();
    context.closePath();
}
function circle(context, x, y, color) {
    context.beginPath();
    context.strokeStyle = color;
    // context.fillStyle = '#fff';
    context.lineWidth = 4;
    context.arc(x, y, CIRCLE_RADIUS, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.closePath();
}
function computeBoundaries(columns) {
    let min = 0;
    let max = 0;
    columns.forEach((col) => {
        if (typeof min !== 'number')
            min = col[0];
        if (typeof max !== 'number')
            max = col[0];
        if (min > col[0])
            min = col[0];
        if (max < col[0])
            max = col[0];
        for (let i = 1; i < col.length; i++) {
            if (min > col[i])
                min = col[i];
            if (max < col[i])
                max = col[i];
        }
    });
    return [min, max];
}
function toCoordinates(xRatio, yRatio) {
    return (y, i) => [
        Math.round((i - 1) * xRatio),
        Math.round(DPI_HEIGHT - PADDING - y * yRatio),
    ];
}
function css(el, styles = {}) {
    Object.assign(el.style, styles);
}
function formatLabel(value, type) {
    if (type === FORMAT_TYPES.DATE) {
        return new Date(value).toLocaleDateString('en-GB');
    }
    else
        return value;
}

const template = (data) => `
  <div style="
		font: inherit;	
		text-align: left;
		margin-bottom: 0.5rem;
		white-space: nowrap;
		font-size: 0.5rem;
	">${data.title}</div>
  <ul style="
		display: flex;
		flex-direction: column;
		list-style: none;
		margin: 0;
		padding: 0;
	">
    ${data.items
    .map((item) => {
    return `<li style="
					display: flex;
					flex-direction: row;
					align-items: center;
					flex-grow: 1;
				">
				<div style="
					background: ${item.color};
					border-radius: 50%;
					width: 0.5rem;
					height: 0.5rem;
				"></div>
        <div style="
				padding-left: 0.3rem;
				font-weight: bold;
				font-size: 0.8rem;"
				>${item.name}:</div>
        <div style="
				font-size: 0.8rem;
				padding-left: 0.5rem;">
				${item.value}
				</div>
      </li>`;
})
    .join('\n')}
  </ul>
`;
function getTooltip(el) {
    const clear = () => (el.innerHTML = '');
    return {
        show(proxyMouse, data) {
            const { height, width } = el.getBoundingClientRect();
            const { left, top } = proxyMouse;
            clear();
            css(el, {
                display: 'block',
                top: top - height + 'px',
                left: left + width / 2 + 'px',
            });
            el.insertAdjacentHTML('afterbegin', template(data));
        },
        hide() {
            css(el, { display: 'none' });
        },
    };
}

class ChartConstructor {
    constructor(columnDetails, xData, yData, selectors) {
        this.mousemove = ({ clientX, clientY }) => {
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
        this.mouseleave = () => {
            cancelAnimationFrame(this.proxy.mouse.raf);
            this.proxy.mouse = null;
            this.tooltip.hide();
        };
        this.clear = () => {
            this.context.clearRect(0, 0, DPI_WIDTH, DPI_HEIGHT);
        };
        this.paint = () => {
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
                        break;
                    }
                }
            });
        };
        this.yAxis = (yMin, yMax) => {
            const step = VIEW_HEIGHT / ROWS_COUNT;
            const textStep = (yMax - yMin) / ROWS_COUNT;
            this.context.beginPath();
            this.context.lineWidth = 1;
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
        this.xAxis = (xData, yData, xRatio) => {
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
        this.init = () => {
            this.paint();
        };
        this.destroy = () => {
            if (this.raf) {
                cancelAnimationFrame(this.raf);
            }
            this.canvas.removeEventListener('mousemove', this.mousemove);
            this.canvas.removeEventListener('mouseleave', this.mouseleave);
        };
        this.root = document.getElementById(selectors.rootSelector);
        this.canvas = this.root.querySelector(selectors.canvasSelector);
        this.context = this.canvas.getContext('2d');
        this.tooltip = getTooltip(this.root.querySelector(selectors.tooltipSelector));
        this.columnDetails = columnDetails;
        this.xData = xData;
        this.yData = yData;
        this.raf = null;
        this.proxy = new Proxy({}, {
            set(...args) {
                const [, , mouse] = args;
                const result = Reflect.set(...args);
                if (mouse) {
                    mouse.raf = requestAnimationFrame(mouse.callback);
                }
                return result;
            },
        });
        this.canvas.style.width = WIDTH + 'px';
        this.canvas.style.height = HEIGHT + 'px';
        this.canvas.width = DPI_WIDTH;
        this.canvas.height = DPI_HEIGHT;
        this.canvas.addEventListener('mousemove', this.mousemove);
        this.canvas.addEventListener('mouseleave', this.mouseleave);
    }
}

const BoringChart = (props) => {
    const { columnDetails, xData, yData, rootSelector, canvasSelector, tooltipSelector, } = props;
    React__default["default"].useEffect(() => {
        const tgChart = new ChartConstructor(columnDetails, xData, yData, {
            rootSelector,
            canvasSelector,
            tooltipSelector,
        });
        tgChart.init();
    }, []);
    return (jsxRuntime.jsx("div", Object.assign({ className: style.card }, { children: jsxRuntime.jsxs("div", Object.assign({ className: style.innerContainer, id: "chart" }, { children: [jsxRuntime.jsx("div", { "data-el": "tooltip", className: style.tooltip }, void 0), jsxRuntime.jsx("canvas", {}, void 0)] }), void 0) }), void 0));
};

exports.BoringChart = BoringChart;
//# sourceMappingURL=index.d.ts.map
