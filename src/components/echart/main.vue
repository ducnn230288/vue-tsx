<script setup lang="tsx" name="CEChart">
import { ref, useTemplateRef, watch } from 'vue';

import type {
  CallbackDataParams,
  CommonTooltipOption,
  EChartsType,
  GridOption,
  LegendComponentOption,
  OptionDataValue,
  SeriesOption,
  TitleOption,
  TooltipOption,
  XAXisOption,
  YAXisOption,
} from './types';

import { ETypeChart } from '@/enums';
import type Props from './interface';

/**
 * CEChart component is a customizable chart component that uses ECharts library.
 * It accepts various options and renders different types of charts based on the provided data.
 */
const {
  option,
  style = { height: '20rem' },
  color = ['#006ae6', '#d74e00', '#272134', '#883fff', '#00a261', '#c59a00', '#e42855'],
} = defineProps<Props>();

const parentRef = useTemplateRef<HTMLDivElement>('parentRef');
const refOption = ref<{
  title: TitleOption;
  tooltip: TooltipOption | CommonTooltipOption<any>;
  legend: LegendComponentOption | undefined;
  series: SeriesOption | SeriesOption[] | undefined;
  xAxis: XAXisOption | undefined;
  yAxis: YAXisOption | YAXisOption[] | undefined;
  grid: GridOption;
  color: string[];
}>({
  title: { text: option.title, left: 'center' },
  tooltip: { trigger: 'item' },
  legend: { top: 'bottom', left: 'center' },
  series: undefined,
  xAxis: { splitLine: { lineStyle: { type: 'dashed' } } },
  yAxis: {
    splitLine: { lineStyle: { type: 'dashed' } },
    scale: true,
  },
  grid: {
    left: '30px',
    right: '30px',
    bottom: '30px',
    containLabel: true,
  },
  color,
});
/**
 * Formats a number by adding commas as thousand separators.
 *
 * @param num - The number to be formatted.
 * @returns The formatted number as a string.
 */
const formatNumber = (num: number) => {
  // eslint-disable-next-line
  return num.toString().replace(/(?=(\B)(\d{3})+$)/g, ',');
};
/**
 * Reference to the ECharts instance.
 */
const refChart = ref<EChartsType>();
/**
 * Configuration object for hiding axis in EChart.
 */
const hideAxis = {
  axisLine: {
    show: false,
  },
  axisTick: {
    show: false,
  },
  axisLabel: {
    show: false,
  },
};

const geneateOption = {
  [ETypeChart.Bar]: () => {
    refOption.value.tooltip = { trigger: 'axis' };
    refOption.value.xAxis = { ...refOption.value.xAxis, type: 'category', data: option.category };
    refOption.value.series = option.series.map((item: any) => ({
      data: item.value,
      name: item.name,
      type: 'bar',
    }));
  },
  [ETypeChart.Line]: () => {
    refOption.value.tooltip = { trigger: 'axis' };
    refOption.value.xAxis =
      option.series.length > 1
        ? { ...refOption.value.xAxis, type: 'category', boundaryGap: false, data: option.category }
        : {
            ...refOption.value.xAxis,
            ...hideAxis,
            type: 'value',
            minorTick: {
              show: true,
            },
            minorSplitLine: {
              show: true,
            },
          };
    if (option.series.length === 1) {
      refOption.value.yAxis = { ...refOption.value.yAxis, ...hideAxis };
    } else {
      refOption.value.yAxis = { min: 0 };
    }
    refOption.value.series = option.series.map((item: any) => ({
      data: item.value,
      name: item.name,
      type: 'line',
      smooth: true,
    }));
  },
  [ETypeChart.Area]: () => {
    refOption.value.tooltip = { trigger: 'axis' };
    refOption.value.xAxis =
      option.series.length > 1
        ? { ...refOption.value.xAxis, type: 'category', boundaryGap: false, data: option.category }
        : {
            ...refOption.value.xAxis,
            type: 'value',
            minorTick: {
              show: true,
            },
            minorSplitLine: {
              show: true,
            },
            ...hideAxis,
          };
    if (option.series.length === 1) {
      refOption.value.yAxis = { ...refOption.value.yAxis, ...hideAxis };
    }
    refOption.value.series = option.series.map((item: any, index: number) => ({
      data: item.value,
      name: item.name,
      type: 'line',
      smooth: true,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: color[index],
          },
          {
            offset: 1,
            color: 'rgba(0, 0, 0, 0)',
          },
        ]),
      },
    }));
  },
  [ETypeChart.StackedArea]: () => {
    refOption.value.tooltip = { trigger: 'axis' };
    refOption.value.xAxis = {
      ...refOption.value.xAxis,
      type: 'category',
      boundaryGap: false,
      data: option.category,
    };
    refOption.value.series = option.series.map((item: any) => ({
      data: item.value,
      name: item.name,
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series',
      },
      smooth: true,
    }));
  },
  [ETypeChart.LineBar]: () => {
    refOption.value.tooltip = { trigger: 'axis' };
    refOption.value.xAxis = { ...refOption.value.xAxis, type: 'category', data: option.category };
    refOption.value.yAxis = [
      { type: 'value', name: option.series.slice(0, option.series.length - 2).map((item: any) => item.name) },
      { type: 'value', name: option.series.slice(option.series.length - 2).map((item: any) => item.name) },
    ];

    refOption.value.series = [
      ...option.series.slice(0, option.series.length - 2).map((item: any) => ({
        data: item.value,
        name: item.name,
        type: 'bar',
      })),
      ...option.series.slice(option.series.length - 2).map((item: any) => ({
        data: item.value,
        name: item.name,
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
      })),
    ];
  },
  [ETypeChart.StackedBar]: () => {
    refOption.value.xAxis = { ...refOption.value.xAxis, type: 'category', data: option.category };
    refOption.value.series = option.series.map((item: any) => ({
      name: item.name,
      type: 'bar',
      stack: 'total',
      data: item.value,
    }));
  },
  [ETypeChart.Pie]: () => {
    refOption.value.xAxis = undefined;
    refOption.value.yAxis = undefined;
    refOption.value.series = option.series.map((series: any) => ({
      ...series,
      type: 'pie',
      radius: '70%',
      label: {
        color: 'inherit',
      },
    }));
  },
  [ETypeChart.Ring]: () => generateRing({ type: ETypeChart.Ring }),
  [ETypeChart.RingHalfDonut]: () => generateRing({ type: ETypeChart.RingHalfDonut }),
  [ETypeChart.Scatter]: () => {
    refOption.value.tooltip = {
      formatter: (obj: CallbackDataParams) => {
        const { value, marker, seriesName } = obj;
        const v = value as OptionDataValue[];
        return (
          marker +
          ' ' +
          seriesName +
          '<br>' +
          v[2] +
          ' <strong>' +
          v[0] +
          '</strong><br>' +
          v[3] +
          ' <strong>' +
          v[1] +
          '</strong><br>'
        );
      },
    };
    refOption.value.series = option.series.map((item: any) => ({
      data: item.value,
      name: item.name,
      type: 'scatter',
      symbolSize: 10,
    }));
    refOption.value.grid.bottom = 30 * Math.ceil(option.series.length / (parentRef.value!.clientWidth / 73)) + 'px';
  },
  [ETypeChart.Bubble]: () => {
    refOption.value.tooltip = {
      formatter: ({ value, marker, seriesName }: CallbackDataParams) => {
        const v = value as OptionDataValue[];
        return (
          marker +
          ' ' +
          seriesName +
          '<br>' +
          v[3] +
          ' <strong>' +
          v[0] +
          '</strong><br>' +
          v[4] +
          ' <strong>' +
          v[1] +
          '</strong><br>' +
          v[5] +
          ' <strong>' +
          v[2] +
          '</strong><br>'
        );
      },
    };
    refOption.value.series = option.series.map((series: any) => ({
      name: series.name,
      data: series.value,
      type: 'scatter',
      symbolSize: function (data: any) {
        return Math.sqrt(data[2]) / 5e2;
      },
      itemStyle: {
        shadowBlur: 1,
        opacity: 1,
      },
    }));
  },
};
const generateRing = ({ type }: { type: ETypeChart }) => {
  const halfDount = {
    itemStyle: {
      normal: {
        borderColor: 'rgba(255,255,255,1)',
        borderWidth: 4,
      },
    },
    startAngle: 180,
    endAngle: 360,
    label: {
      show: false,
    },
  };
  refOption.value.xAxis = undefined;
  refOption.value.yAxis = undefined;
  if (type === ETypeChart.RingHalfDonut) refOption.value.legend = undefined;
  refOption.value.series = [
    ...option.series.map((series: any) => {
      if (option.type === ETypeChart.RingHalfDonut) {
        series.data.push({
          value: 100 - series.data[0].value,
          itemStyle: {
            color: 'rgba(255,255,255,1)',
            label: {
              color: 'inherit',
            },
          },
        });
      }

      return {
        ...series,
        ...(option.type === ETypeChart.RingHalfDonut
          ? halfDount
          : {
              label: {
                color: 'inherit',
              },
            }),

        type: 'pie',
        radius: ['50%', '70%'],
      };
    }),
    option.type === ETypeChart.Ring
      ? {
          itemStyle: {
            normal: {
              color: 'rgba(255,255,255,0.9)',
            },
          },
          type: 'pie',
          hoverAnimation: false,
          radius: ['48%', '72%'],
          center: ['50%', '50%'],
          label: {
            normal: {
              show: false,
            },
          },
          data: [
            {
              value: 1,
            },
          ],
          z: -1,
        }
      : {},
  ];
  refOption.value.title = {
    text:
      '{val|' +
      (option.type === ETypeChart.Ring
        ? formatNumber(
            option.series[0].data.reduce((a: any, b: any) => {
              return a + b.value * 1;
            }, 0),
          )
        : option.series[0].data[0].value + '%') +
      '}\n{name|' +
      option.title +
      '}',
    top: option.type === ETypeChart.Ring ? 'center' : '38%',
    left: 'center',
    textStyle: {
      rich: {
        val: {
          fontSize: 30,
          fontWeight: 'bold',
        },
        name: {
          padding: [5, 0],
        },
      },
    },
  };
};
watch(
  () => [option],
  () => {
    setTimeout(() => {
      if (option) {
        geneateOption[option.type]();
        /**
         * Represents the configuration options for an EChart.
         */
        if (!refChart.value)
          setTimeout(() => {
            refChart.value = echarts.init(parentRef.value, null, { renderer: 'svg' });
            refChart.value?.setOption(refOption.value);
          });
        else refChart.value.setOption(refOption.value, true);
      }
    }, 0);
  },
  { immediate: true },
);
</script>
<template>
  <div :style="style" ref="parentRef" />
</template>
