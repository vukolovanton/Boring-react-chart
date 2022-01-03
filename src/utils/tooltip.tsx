import { css } from './helpers';
import { TooltipData, ProxyMouse, TooltipFunction } from './types';

const template = (data: TooltipData) => `
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

export function getTooltip(el: HTMLElement): TooltipFunction {
	const clear = () => (el.innerHTML = '');

	return {
		show(proxyMouse: ProxyMouse, data: TooltipData) {
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
