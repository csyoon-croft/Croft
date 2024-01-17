// 필요한 라이브러리를 임포트합니다.
import * as echarts from "echarts";
import React, { useEffect, useRef } from "react";
import { useChartData } from "../../utils/api/Charts/ChartAPI";

const Bar2Line1Chart = ({ ChartName }) => {
  const chartRef = useRef(null);
  const {
    data: dataDLI,
    isLoading: isLoadingDLI,
    error: errorDLI,
  } = useChartData(
    "http://croft-ai.iptime.org:40401/api/v1/farms/dli/aweek",
    "chartData-DLI"
  );

  const {
    data: dataMeasurement,
    isLoading: isLoadingMeasurement,
    error: errorMeasurement,
  } = useChartData(
    "http://croft-ai.iptime.org:40401/api/v1/farms/measurement/day?data_type=219",
    "chartData-Measurement219"
  );

  useEffect(() => {
    if (isLoadingDLI || errorDLI) {
      // 데이터 로딩 중이거나 오류 발생시 처리
      return;
    }

    if (!dataDLI || !dataDLI.data) {
      // 데이터가 없거나 잘못된 형식일 경우 처리
      return;
    }

    console.log(dataDLI);
    console.log(dataMeasurement);

    const dliValues = dataDLI.data.map((item) => item.dli);
    const dataMeasurementValues = dataMeasurement.data.map((item) => item.dli);

    const chartInstance = echarts.init(chartRef.current);

    const option = {
      title: {
        text: ChartName,
        top: "5%",
        left: "2%",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      legend: {
        data: ["외부 광량", "온실 광량", "DLI"],
        textStyle: {
          color: "#333", // 범례 텍스트 색상
          fontSize: 12, // 범례 텍스트 크기
        },
        itemWidth: 10,
        itemHeight: 10,
        icon: "rect",
      },
      xAxis: {
        axisLabel: {
          fontSize: 10,
          margin: "10",
        },
        type: "category",
        boundaryGap: false, // 선 차트에 대해 경계 간격을 없앰
        data: [
          "0시",
          "2시",
          "4시",
          "6시",
          "8시",
          "10시",
          "12시",
          "14시",
          "16시",
          "18시",
          "20시",
          "22시",
          "24시",
        ], // x축 데이터
      },
      yAxis: {
        axisLabel: {
          fontSize: 10,
          margin: "10",
        },
        type: "value",
        min: 0,
        max: 80, // 범위가 안나와있음
        interval: 10,
      },
      series: [
        {
          name: "외부 광량",
          type: "bar",
          data: [0, 34, 37, 24, 4, 40, 15, 25, 35, 5, 18, 22, 2], // 10.25 데이터
          barWidth: "25%", // 막대 너비
          color: "#4472c4",
          barGap: "10%", // 다른 시리즈의 막대와의 간격
        },
        {
          name: "온실 광량",
          type: "bar",
          data: [0, 5, 12, 16, 18, 25, 29, 34, 37, 24, 40, 15, 20],
          barWidth: "25%", // 막대 너비
          color: "rgba(79, 254, 35, 0.5)", // #4FFE234D와 유사한 RGBA 색상
          barGap: "10%", // 다른 시리즈의 막대와의 간격
        },
        {
          name: "DLI",
          type: "line",
          data: [0, 17, 28, 38, 44, 52, 61, 57, 71, 77, 66, 61, 57],
          lineStyle: {
            color: "rgb(255, 0, 0 , 0.5)", // 빨강
          },
          itemStyle: {
            color: "rgb(255, 0, 0 , 0.5)", // 빨강
          },
          markArea: {
            itemStyle: {
              color: "rgba(79, 254, 35, 0.3)", // #4FFE234D와 유사한 RGBA 색상
            },
            data: [
              [
                { yAxis: 50 }, // 시작 y축 값
                { yAxis: 70 }, // 끝 y축 값 (차트 최대값까지)
              ],
            ],
          },
        },
      ],
    };

    chartInstance.setOption(option);

    return () => {
      chartInstance.dispose();
    };
  }, [dataDLI, dataMeasurement]);

  return <div ref={chartRef} style={{ width: "480px", height: "380px" }} />;
};

export default Bar2Line1Chart;
