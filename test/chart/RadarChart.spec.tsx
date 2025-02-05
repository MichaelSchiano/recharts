import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { describe, test, it, expect, vi } from 'vitest';
import { exampleRadarData } from '../_data';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from '../../src';
import { testChartLayoutContext } from '../util/context';
import { assertNotNull } from '../helper/assertNotNull';

export type ExpectedRadarPolygon = {
  d: string;
  fill: string;
  fillOpacity: string;
};

function expectRadarPolygons(container: HTMLElement, expected: ReadonlyArray<ExpectedRadarPolygon>) {
  const polygons = container.querySelectorAll('.recharts-radar-polygon path.recharts-polygon');
  assertNotNull(polygons);

  const actualPolygons = Array.from(polygons).map(polygon => ({
    d: polygon.getAttribute('d'),
    fill: polygon.getAttribute('fill'),
    fillOpacity: polygon.getAttribute('fill-opacity'),
  }));

  expect(actualPolygons).toEqual(expected);
}

describe('<RadarChart />', () => {
  test('Render 1 polygon in a simple Radar', () => {
    const { container } = render(
      <RadarChart cx={100} cy={150} outerRadius={150} width={600} height={500} data={exampleRadarData}>
        <Radar dataKey="value" />
      </RadarChart>,
    );
    expectRadarPolygons(container, [
      {
        d: 'M100,150L100,150L100,150L100,150L100,150L100,150L100,150L100,150L100,150Z',
        fill: null,
        fillOpacity: null,
      },
    ]);
  });

  test('innerRadius prop does not do anything', () => {
    const commonProps = {
      width: 600,
      height: 500,
      data: exampleRadarData,
    };
    const expectedPolygons: ReadonlyArray<ExpectedRadarPolygon> = [
      {
        d: 'M300,250L300,250L300,250L300,250L300,250L300,250L300,250L300,250L300,250Z',
        fill: null,
        fillOpacity: null,
      },
    ];
    const { container, rerender } = render(
      <RadarChart innerRadius={10} {...commonProps}>
        <Radar dataKey="value" />
      </RadarChart>,
    );
    expectRadarPolygons(container, expectedPolygons);

    rerender(
      <RadarChart innerRadius={20} {...commonProps}>
        <Radar dataKey="value" />
      </RadarChart>,
    );
    expectRadarPolygons(container, expectedPolygons);
  });

  test('outerRadius prop does not do anything', () => {
    const commonProps = {
      width: 600,
      height: 500,
      data: exampleRadarData,
    };
    const expectedPolygons: ReadonlyArray<ExpectedRadarPolygon> = [
      {
        d: 'M300,250L300,250L300,250L300,250L300,250L300,250L300,250L300,250L300,250Z',
        fill: null,
        fillOpacity: null,
      },
    ];
    const { container, rerender } = render(
      <RadarChart outerRadius={10} {...commonProps}>
        <Radar dataKey="value" />
      </RadarChart>,
    );
    expectRadarPolygons(container, expectedPolygons);

    rerender(
      <RadarChart outerRadius={20} {...commonProps}>
        <Radar dataKey="value" />
      </RadarChart>,
    );
    expectRadarPolygons(container, expectedPolygons);
  });

  test('clockWise prop does not do anything', () => {
    const commonProps = {
      width: 600,
      height: 500,
      data: exampleRadarData,
    };
    const expectedPolygons: ReadonlyArray<ExpectedRadarPolygon> = [
      {
        d: 'M300,250L300,250L300,250L300,250L300,250L300,250L300,250L300,250L300,250Z',
        fill: null,
        fillOpacity: null,
      },
    ];
    const { container, rerender } = render(
      // @ts-expect-error typescript says the clockWise prop does not exist, but it's documented on the website, why?
      <RadarChart clockWise {...commonProps}>
        <Radar dataKey="value" />
      </RadarChart>,
    );
    expectRadarPolygons(container, expectedPolygons);

    rerender(
      // @ts-expect-error typescript says the clockWise prop does not exist, but it's documented on the website, why?
      <RadarChart clockWise={false} {...commonProps}>
        <Radar dataKey="value" />
      </RadarChart>,
    );
    expectRadarPolygons(container, expectedPolygons);
  });

  test('startAngle and endAngle props do not do anything', () => {
    const commonProps = {
      width: 600,
      height: 500,
      data: exampleRadarData,
    };

    const { container, rerender } = render(
      <RadarChart startAngle={20} endAngle={70} {...commonProps}>
        <Radar dataKey="value" />
      </RadarChart>,
    );

    expectRadarPolygons(container, [
      {
        d: 'M300,250L300,250L300,250L300,250L300,250L300,250L300,250L300,250L300,250Z',
        fill: null,
        fillOpacity: null,
      },
    ]);

    rerender(
      <RadarChart startAngle={90} endAngle={270} {...commonProps}>
        <Radar dataKey="value" />
      </RadarChart>,
    );
    expectRadarPolygons(container, [
      {
        d: 'M300,250L300,250L300,250L300,250L300,250L300,250L300,250L300,250L300,250Z',
        fill: null,
        fillOpacity: null,
      },
    ]);
  });

  test('renders multiple polygons with different dataKeys', () => {
    const { container } = render(
      <RadarChart cx={300} cy={250} outerRadius={150} width={600} height={500} data={exampleRadarData}>
        <Radar dataKey="value" fill="green" fillOpacity={0.3} />
        <Radar dataKey="half" fill="blue" fillOpacity={0.6} />
      </RadarChart>,
    );

    expectRadarPolygons(container, [
      {
        d: 'M300,250L300,250L300,250L300,250L300,250L300,250L300,250L300,250L300,250Z',
        fill: 'green',
        fillOpacity: '0.3',
      },
      {
        d: 'M300,250L300,250L300,250L300,250L300,250L300,250L300,250L300,250L300,250Z',
        fill: 'blue',
        fillOpacity: '0.6',
      },
    ]);
  });

  it('should move the polygons when cx and cy are percent string', () => {
    const { container } = render(
      <RadarChart cx="10%" cy="90%" outerRadius={150} width={600} height={500} data={exampleRadarData}>
        <Radar dataKey="value" fill="green" fillOpacity={0.3} />
        <Radar dataKey="half" fill="blue" fillOpacity={0.6} />
      </RadarChart>,
    );

    expectRadarPolygons(container, [
      {
        d: 'M60,450L60,450L60,450L60,450L60,450L60,450L60,450L60,450L60,450Z',
        fill: 'green',
        fillOpacity: '0.3',
      },
      {
        d: 'M60,450L60,450L60,450L60,450L60,450L60,450L60,450L60,450L60,450Z',
        fill: 'blue',
        fillOpacity: '0.6',
      },
    ]);
  });

  it('should place the polygons in the middle by default when cx and cy are undefined', () => {
    const { container } = render(
      <RadarChart outerRadius={150} width={600} height={500} data={exampleRadarData}>
        <Radar dataKey="value" fill="green" fillOpacity={0.3} />
        <Radar dataKey="half" fill="blue" fillOpacity={0.6} />
      </RadarChart>,
    );

    expectRadarPolygons(container, [
      {
        d: 'M300,250L300,250L300,250L300,250L300,250L300,250L300,250L300,250L300,250Z',
        fill: 'green',
        fillOpacity: '0.3',
      },
      {
        d: 'M300,250L300,250L300,250L300,250L300,250L300,250L300,250L300,250L300,250Z',
        fill: 'blue',
        fillOpacity: '0.6',
      },
    ]);
  });

  // TODO this appears to be broken, fix! It also means that storybook controls never updated the preview.
  it.fails('should move polygons when cx and cy and outerRadius are updated', () => {
    const { container, rerender } = render(
      <RadarChart cx={100} cy={120} outerRadius={150} width={600} height={500} data={exampleRadarData}>
        <Radar dataKey="value" fill="green" fillOpacity={0.3} />
        <Radar dataKey="half" fill="blue" fillOpacity={0.6} />
      </RadarChart>,
    );

    expectRadarPolygons(container, [
      {
        d: 'M100,120L100,120L100,120L100,120L100,120L100,120L100,120L100,120L100,120Z',
        fill: 'green',
        fillOpacity: '0.3',
      },
      {
        d: 'M100,120L100,120L100,120L100,120L100,120L100,120L100,120L100,120L100,120Z',
        fill: 'blue',
        fillOpacity: '0.6',
      },
    ]);

    rerender(
      <RadarChart cx={200} cy={230} outerRadius={100} width={600} height={500} data={exampleRadarData}>
        <Radar dataKey="value" fill="green" fillOpacity={0.3} />
        <Radar dataKey="half" fill="blue" fillOpacity={0.6} />
      </RadarChart>,
    );

    expectRadarPolygons(container, [
      {
        d: 'M200,230L200,230L200,230L200,230L200,230L200,230L200,230L200,230L200,230Z',
        fill: 'green',
        fillOpacity: '0.3',
      },
      {
        d: 'M200,230L200,230L200,230L200,230L200,230L200,230L200,230L200,230L200,230Z',
        fill: 'blue',
        fillOpacity: '0.6',
      },
    ]);
  });

  test('Render 8 dots when dot=true', () => {
    const { container } = render(
      <RadarChart cx={300} cy={250} outerRadius={150} width={600} height={500} data={exampleRadarData}>
        <Radar isAnimationActive={false} dot dataKey="value" />
      </RadarChart>,
    );
    expect(container.querySelectorAll('.recharts-radar-dot')).toHaveLength(8);
  });

  test('Render 8 labels when label=true', () => {
    const { container } = render(
      <RadarChart cx={300} cy={250} outerRadius={150} width={600} height={500} data={exampleRadarData}>
        <Radar isAnimationActive={false} label dataKey="value" />
      </RadarChart>,
    );
    expect(container.querySelectorAll('.recharts-label')).toHaveLength(8);
  });

  test('Render 1 PolarGrid 1 PolarAngleAxis and 1 PolarRadiusAxis in simple Radar', () => {
    const { container } = render(
      <RadarChart
        cx={300}
        cy={250}
        startAngle={45}
        innerRadius={20}
        outerRadius={150}
        width={600}
        height={500}
        data={exampleRadarData}
      >
        <Radar dataKey="value" fill="#9597E4" fillOpacity={0.6} stroke="#8889DD" strokeWidth={3} />
        <PolarGrid />
        <PolarAngleAxis />
        <PolarRadiusAxis orient="middle" angle={67.5} />
      </RadarChart>,
    );
    expect(container.querySelectorAll('.recharts-polar-grid')).toHaveLength(1);
    expect(container.querySelectorAll('.recharts-polar-angle-axis')).toHaveLength(1);
    expect(container.querySelectorAll('.recharts-polar-radius-axis')).toHaveLength(1);
  });

  test('Render 8 angle grid angle line, 8 angle axis ticks, and 5 radius axis ticks', () => {
    const { container } = render(
      <RadarChart
        cx={300}
        cy={250}
        startAngle={45}
        innerRadius={20}
        outerRadius={150}
        width={600}
        height={500}
        data={exampleRadarData}
      >
        <Radar dataKey="value" fill="#9597E4" fillOpacity={0.6} stroke="#8889DD" strokeWidth={3} />
        <PolarGrid />
        <PolarAngleAxis />
        <PolarRadiusAxis orient="middle" angle={67.5} />
      </RadarChart>,
    );
    expect(container.querySelectorAll('.recharts-polar-grid .recharts-polar-grid-angle line')).toHaveLength(8);
    expect(container.querySelectorAll('.recharts-polar-angle-axis .recharts-polar-angle-axis-tick')).toHaveLength(8);
    expect(container.querySelectorAll('.recharts-polar-radius-axis .recharts-polar-radius-axis-tick')).toHaveLength(5);
  });

  test('click on Sector should invoke onClick callback', () => {
    const onClick = vi.fn();
    const { container } = render(
      <RadarChart cx={300} cy={250} outerRadius={150} width={600} height={500} data={exampleRadarData}>
        <Radar dataKey="value" onClick={onClick} />
      </RadarChart>,
    );
    const radar = container.querySelector('.recharts-polygon');
    assertNotNull(radar);
    fireEvent.click(radar);
    expect(onClick).toBeCalled();
  });

  describe('RadarChart layout context', () => {
    it(
      'should provide viewBox and clipPathId if there are no axes',
      testChartLayoutContext(
        props => (
          <RadarChart width={100} height={50} barSize={20}>
            {props.children}
          </RadarChart>
        ),
        ({ clipPathId, viewBox, xAxisMap, yAxisMap }) => {
          expect(clipPathId).toMatch(/recharts\d+-clip/);
          expect(viewBox).toEqual({ height: 40, width: 90, x: 5, y: 5 });
          expect(xAxisMap).toBe(undefined);
          expect(yAxisMap).toBe(undefined);
        },
      ),
    );

    it(
      'should set width and height in context',
      testChartLayoutContext(
        props => (
          <RadarChart width={100} height={50} barSize={20}>
            {props.children}
          </RadarChart>
        ),
        ({ width, height }) => {
          expect(width).toBe(100);
          expect(height).toBe(50);
        },
      ),
    );

    it(
      'should provide axisMaps: undefined even if axes are specified',
      testChartLayoutContext(
        props => (
          <RadarChart width={100} height={50} barSize={20}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            {props.children}
          </RadarChart>
        ),
        ({ clipPathId, viewBox, xAxisMap, yAxisMap }) => {
          expect(clipPathId).toMatch(/recharts\d+-clip/);
          expect(viewBox).toEqual({ x: 5, y: 5, width: 90, height: 40 });
          expect(xAxisMap).toBe(undefined);
          expect(yAxisMap).toBe(undefined);
        },
      ),
    );
  });
});
