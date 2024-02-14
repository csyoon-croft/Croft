import React from "react";

// @ts-ignore
import {ChartBase} from "./ChartBase.tsx";

export const EnergyTempChart = ({ period, onClick }) => {

    return <ChartBase
        title={{text:''}}
        dataInfo={{url: '/api/v1/farms/energy/usage', parameters: { period }}}
        onClick={onClick}
        chartOptions={{
            grid: {
                top: '60px',
                left: '2%',
                right: '2%',
                bottom: '3%',
                containLabel: true
            },
            legend: {
                show: true,
            },
            xAxis: {
                type: 'category',
                data_shape: 'tabular_series_in_columns',
                data_access(row){
                    return row['kr_time'].substring(0, 10)
                } ,
            },
            yAxis: [
                {
                    type: 'value',
                    name: '평균 온도(°C)',
                    alignTicks: true,
                    nameTextStyle: {
                        align: 'left'
                    },
                },
                {
                    type: 'value',
                    name: 'min',
                    alignTicks: true,
                    nameTextStyle: {
                        align: 'left'
                    },
                }
            ],
            series: [
                {
                    name: 'Rail 온도',
                    type: 'line',
                    data_shape: 'tabular_series_in_columns',
                    data_access: 'temp_rail_avg',
                    smooth: true,
                    tooltip: {
                        valueFormatter: (value) => ''+ value + ' °C'
                    }
                },
                {
                    name: '실외 온도',
                    type: 'line',
                    data_shape: 'tabular_series_in_columns',
                    data_access: 'temp_meteo_avg',
                    smooth: true,
                    tooltip: {
                        valueFormatter: (value) => ''+ value + ' °C'
                    }
                },
                {
                    name: 'Rail 작동시간',
                    type: 'line',
                    yAxisIndex: 1,
                    data_shape: 'tabular_series_in_columns',
                    data_access: 'actuation_rail',
                    smooth: true,
                    tooltip: {
                        valueFormatter: (value) => ''+ value + ' min'
                    }
                },
                {
                    name: 'FCU 작동시간',
                    type: 'line',
                    yAxisIndex: 1,
                    data_shape: 'tabular_series_in_columns',
                    data_access: 'actuation_fcu',
                    smooth: true,
                    tooltip: {
                        valueFormatter: (value) => ''+ value + ' min'
                    }
                }
            ]
        }}
    />
}


export const EnergyChart = ({ period, onClick }) => {

    return <ChartBase
        title={{text:''}}
        dataInfo={{url: '/api/v1/farms/energy/usage', parameters: {period }}}
        onClick={onClick}
        chartOptions={{
            grid: {
                top: '60px',
                left: '2%',
                right: '2%',
                bottom: '3%',
                containLabel: true
            },
            legend: {
                show: true,
            },
            xAxis: {
                type: 'category',
                data_shape: 'tabular_series_in_columns',
                data_access(row){
                    return row['kr_time'].substring(0, 10)
                } ,
            },
            yAxis: [
                {
                    type: 'value',
                    name: '예상 비용(₩)',
                    nameLocation: 'end',
                    nameTextStyle: {
                        align: 'center'
                    },
                    alignTicks: true,
                }
            ],
            series: [
                {
                    name: '비용 예측',
                    type: 'line',
                    data_shape: 'tabular_series_in_columns',
                    data_access: 'rail_energy_usage',
                    smooth: true,
                    tooltip: {
                        valueFormatter: (value) => ''+ value.toFixed(2) + ' ₩'
                    }
                }
            ]
        }}
    />
}

export const MonthlyEnergyChart = ({ period, onClick }) => {
    return <ChartBase
        title={{text:''}}
        dataInfo={{url: '/api/v1/farms/energy/usage', parameters: {period }}}
        onClick={onClick}
        chartOptions={{
            grid: {
                top: '60px',
                left: '2%',
                right: '2%',
                bottom: '3%',
                containLabel: true
            },
            legend: {
                show: true,
            },
            xAxis: {
                type: 'category',
                data_shape: 'tabular_series_in_columns',
                data_access(row){
                    return row['month']
                } ,
            },
            yAxis: [
                {
                    type: 'value',
                    name: '예상 비용(₩)',
                    nameLocation: 'end',
                    nameTextStyle: {
                        align: 'center'
                    },
                    alignTicks: true,
                }
            ],
            series: [
                {
                    name: '비용 예측',
                    type: 'bar',
                    data_shape: 'tabular_series_in_columns',
                    data_access: 'monthly_rail_energy_usage',
                    smooth: true,
                    tooltip: {
                        valueFormatter: (value) => ''+ value.toFixed(2) + ' ₩'
                    }
                }
            ]
        }}
    />
}