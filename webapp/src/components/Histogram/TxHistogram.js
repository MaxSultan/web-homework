import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { css } from '@emotion/core';

const style = css`
  .bars {
    color: grey;
  }

  .barText {
    color: white;
  }
`;

export default function TxHistogram({ data }) {
  const chartRef = useRef();
  //   data = data.sort((a, b) => d3.ascending(a.amount - b.amount));
  console.log(data);
  useEffect(() => {
    const margin = { top: 60, left: 100, bottom: 60, right: 60 },
      width = 750 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    const xMax = d3.max(data, d => d.amount);
    const xScale = d3
      .scaleLinear()
      .domain([0, xMax])
      .range([0, width]);
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(5)
      .tickFormat(d3.format('~s'))
      .tickSizeOuter(0);

    const yScale = d3
      .scaleBand()
      .domain(data.map(d => d.description))
      .rangeRound([0, height])
      .paddingInner(0.1);

    const yAxis = d3.axisLeft(yScale);
    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('height', height + margin.top + margin.bottom)
      .attr('width', width + margin.right + margin.left)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    svg.append('g').call(yAxis);

    const barGroups = svg
      .selectAll('.bars')
      .data(data)
      .enter()
      .append('g');

    barGroups
      .append('rect')
      .attr('width', d => xScale(d.amount))
      .attr('y', d => yScale(d.description))
      .attr('height', yScale.bandwidth())
      .attr('class', 'bars');

    barGroups
      .append('text')
      .attr('class', 'barText')
      .attr('x', d => 5)
      .attr('y', d => yScale(d.description) + 50)
      .text(d => d.amount)
      .attr('fill', 'white');
  }, []);
  return <div ref={chartRef} css={style}></div>;
}
