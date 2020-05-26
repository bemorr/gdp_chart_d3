const w = 900;
const h = 400;
const barWidth = w / 275;

const svgContainer = d3
	.select('.visContainer')
	.append('svg')
	.attr('width', w)
	.attr('height', h);

var tooltip = d3
	.select('.visContainer')
	.append('div')
	.attr('id', 'tooltip')
	.style('opacity', 0);

var overlay = d3
	.select('.visContainer')
	.append('div')
	.attr('id', 'overlay')
	.style('opacity', 0);

d3.json(
	'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json',
	function (err, rawData) {
		svgContainer
			.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('x', -200)
			.attr('y', 80)
			.text('GDP dollars');

		let yearsAndQs = rawData.data.map((d) => {
			switch (d[0].substring(5, 7)) {
				case '01':
					return 'Q1' + ', ' + d[0].substring(0, 4);
				case '04':
					return 'Q2' + ', ' + d[0].substring(0, 4);
				case '07':
					return 'Q3' + ', ' + d[0].substring(0, 4);
				case '10':
					return 'Q4' + ', ' + d[0].substring(0, 4);
				default:
					console.log('there has been an error in switch statement');
			}
		});

		let yearsDate = rawData.data.map((d) => {
			return new date(d[0]);
		});

		let xMax = new Date(d3.max(yearsDate));
		xMax.setMonth(xMax.getMonth() + 3);
		let xScale = d3
			.scaleTime()
			.domain([d3.min(yearsDate), xMax])
			.range([0, 800]);

		const xAxis = d3.axisBottom(xScale);
		//var xAxis = d3.axisBottom()
		//    .scale(xScale);

		const xAxisGroup = svgContainer
			.append('g')
			.call(xAxis)
			.attr('id', 'x-axis')
			.attr('transform', 'translate(60, 400)');

		const GDP = rawData.data.map((d) => {
			return d[1];
		});

		const yMin = d3.min(GDP);
		const yMax = d3.max(GDP);

		const yScale = d3.scaleLinear().domain([yMin, yMax]).range([400, 0]);

		const yAxis = d3.axisLeft(yScale);

		const yAxisGroup = svgContainer
			.append('g')
			.call(yAxis)
			.attr('id', 'y-axis')
			.attr('transform', 'translate(60, 0)');

		const onlyGdpData = rawData.data.map((d) => {
			return d;
		});
		d3.select('svg')
			.selectAll('rect')
			.data(onlyGdpData)
			.enter()
			.append('rect')
			.attr('data-date', function (d, i) {
				return d[i][0];
			})
			.attr('data-gdp', function (d, i) {
				return d[i][1];
			})
			.attr('class', 'bar')
			.attr('x', (d, i) => {
				return xScale(yearsDate[i]);
			})
			.attr('y', (d, i) => {
				return h - yScale(d[1]);
			})
			.attr('width', barWidth)
			.attr('height', (d) => {
				return d;
			})
			.style('fill', '#009900')
			.attr('transform', 'translate(60, 0)');
	}
);
