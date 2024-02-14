import React, {useEffect, useRef, useState} from "react";
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
// @ts-ignore
import clone from "clone"
// @ts-ignore
import { useSize} from "./commonUtil.tsx";
// @ts-ignore
import {BASE_ECHART_OPTION} from "./commonCode.tsx";
import {useQuery} from "@tanstack/react-query";


export const getDataViaRest = async ({queryKey, meta}) => {
    console.log('getDataViaRest queryKey', queryKey)
    let [url, queryParam] = queryKey

    queryParam = JSON.parse(queryParam)

    queryParam = queryParam || []

    if(!Array.isArray(queryParam) && typeof queryParam === 'object') {
        queryParam = Object.entries(queryParam)

        console.log('queryParam XX', queryParam)

    }



    // make full url
    let fullUrl = url
    if(queryParam.length > 0) {
        fullUrl += '?'
        queryParam.forEach((param, idx) => {
            let enc_param = param[0] + '=' + encodeURIComponent(param[1])
            fullUrl += enc_param
            if(idx < queryParam.length - 1) {
                fullUrl += '&'
            }
        })
    }

    return await fetch(fullUrl, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        return res.json()

    }).then(({data}) => {
        console.log('data', data)
        return data
    })
}

interface ChartSeriesProps {
    name: string,
    type: 'line'|'bar',
    data_shape: 'tabular_series_in_columns' | 'tabular_series_in_rows',
    data_access: string | Function,
    smooth: true
}



export function ChartBase({title, dataInfo, chartOptions={}, className='', noXaxis, transformFn, onClick} : {className?:string, hideHeader?:boolean,useOwnDatePicker?:boolean, title:any,  chartOptions:any, dataInfo:{url:string, parameters?:object}, noXaxis?:boolean|undefined, transformFn?:Function, onClick:Function}) {
    let echarts_instance = useRef(null)
    let target = useRef(null)
    let trFn = transformFn || ((data) => data)

    useEffect(() => {
        // console.log('echarts_instance.current', echarts_instance.current)
    }, [])

    const size = useSize(target)

    let _title = title || {text:"Chart title 챠트 타이틀 "}

    const { data, isLoading, error } = useQuery({
        queryKey: [dataInfo.url, JSON.stringify(dataInfo.parameters)],
        queryFn: getDataViaRest,
        initialData: [],
    });

    let _onEvents = {
        click (evt){
            console.log('click', data[evt.dataIndex], evt)
            onClick?.(data[evt.dataIndex])
        },
    }

    let opt = clone(BASE_ECHART_OPTION)

    opt.yAxis = chartOptions.yAxis || [
        {},{}
    ]
    opt.xAxis = chartOptions.xAxis || { type: 'category', show: !noXaxis , axisLabel: {
            formatter: function (value, idx) {
                let nVal = '' + value

                if(nVal.length >= 10) {
                    return idx==0
                        ? nVal
                        : nVal.substring(5)
                    return nVal
                }else if( nVal.length == 8) {
                    return nVal.endsWith("00")
                        ? value + ":00"
                        : nVal.substring(5) + ":00"
                }else {
                    return nVal
                }
            }
        }}

    opt.xAxis.data = data.map((row) => {

        if(opt.xAxis.data_access instanceof Function) {
            return opt.xAxis.data_access(row)
        }

        return row[opt.xAxis.data_access]
    })

    opt.title = _title

    opt.grid = chartOptions.grid || opt.grid
    opt.legend = chartOptions.legend || opt.legend
    opt.visualMap = chartOptions.visualMap || opt.visualMap
    opt.series = chartOptions.series.map((series:ChartSeriesProps) => {
        if(series.data_shape === 'tabular_series_in_columns') {
            series['data'] = data.map((row) => {
                if(series.data_access instanceof Function) {
                    return series.data_access(row)
                }

                // console.log('row', row, series.data_access)
                return row[series.data_access]
            })

        }else if(series.data_shape === 'tabular_series_in_rows') {
            // todo : implement
        }

        return series
    })

    return (
        <div className={"absolute inset-0"} ref={target}>
            <ReactEChartsCore
                onEvents= {_onEvents}
                ref={echarts_instance}
                echarts={echarts}
                option={opt}
                notMerge={true}
                lazyUpdate={true}
                style={{height: size?.height}}
            />
        </div>
    )
}

