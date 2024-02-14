import {useQuery} from "@tanstack/react-query";
import React, {useMemo, useState} from "react";
import useResizeObserver from '@react-hook/resize-observer'
import * as echarts from "echarts/core";

export function makeChartDataFn(queryName, parameters) {
    return async () => {
        return await fetch(
            '/api/generic/query/'+queryName, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(parameters)
            }
        ).then(res => res.json()).then(json => {
            return json['rows']
        })
    }
} // end of makeChartDataFn
export function useChartDataQuery(dataInfo:{queryName:string, parameters:object}, queryKey:any, useOwnDatePicker:boolean) {
    // console.log(useOwnDatePicker, dataInfo, queryKey)
    return useQuery({
        refetchInterval: 5*60*1000, // 5분마다 refresh
        refetchIntervalInBackground: true,
        staleTime: 5000,
        refetchOnWindowFocus: true,
        queryKey: [dataInfo.queryName + ":" + (!useOwnDatePicker ? JSON.stringify(dataInfo.parameters) : JSON.stringify(queryKey))],
        queryFn: useMemo( ()=> makeChartDataFn(dataInfo.queryName, (!useOwnDatePicker ? dataInfo.parameters : queryKey)),[queryKey, JSON.stringify(dataInfo.parameters)])
    })
}

export const useSize = (target) => {
    const [size, setSize] = React.useState()

    React.useLayoutEffect(() => {
        console.log("target", target)
        setSize(target.current?.getBoundingClientRect())
    }, [target])

    // Where the magic happens
    useResizeObserver(target, (entry) => setSize(entry.contentRect))
    return size
}

const GAUGE_ERROR_COLOR = '#fa0606'
const GAUGE_WARN_COLOR = '#eac859'
const GAUGE_GOOD_COLOR = '#1fc700'

/**
 * make echart gradient line color for gauge chart
 * @param series
 * @param colorRange
 */
export function makeGaugeGradient( colorRange = [0,12,25,45]) {


    const _midPoint = (colorRange[1] + colorRange[2]) / 2
    const _midPointRatio = _midPoint / colorRange[3]

    const gColor = [
        [_midPointRatio,  {
            type: 'linear',
            x: 0,
            y: 1,
            x2: 0.71,
            y2: 0,
            colorStops: [{
                offset: 0, color: GAUGE_ERROR_COLOR // color at 0%
            }, {
                offset: colorRange[1]/_midPoint -0.1, color: GAUGE_WARN_COLOR
            }, {
                offset: colorRange[1]/_midPoint +0.1, color: GAUGE_GOOD_COLOR
            }, {
                offset: 1, color: GAUGE_GOOD_COLOR
            }],
        }],
        [1, {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 1,
            colorStops: [{
                offset: 0, color: GAUGE_GOOD_COLOR // color at 0%
            }, {
                offset: (colorRange[2] - _midPoint)/(colorRange[3] - _midPoint) *0.9, color: GAUGE_GOOD_COLOR
            }, {
                offset: (colorRange[2] - _midPoint)/(colorRange[3] - _midPoint) *1.1, color: GAUGE_WARN_COLOR
            }, {
                offset: 1, color: GAUGE_ERROR_COLOR
            }],
        }],
    ]

    return gColor
}


function calcTwoPointDiagonal(maxVal, minVal, value) {
    const rate: number = (value - minVal) / (maxVal - minVal)
    if (rate < 0) {
        // error case : value is less than minVal
        return {x:0, y: 0, x2: 1, y2: 0} // 우측으로 그라디언트
    }else if(rate <= 0.3) {
        return {x:0, y: 0, x2: 1, y2: 1} // 우상향 그라디언트
    }else if(rate <= 0.7) {
        return {x:0, y: 0, x2: 1, y2: 0} // 우측으로 그라디언트
    }else {
        return {x:0, y: 0, x2: 1, y2: .8} // 우하향 그라디언트
    }
}

function calcProgressGradient(colorRange: number[], value: number) {

    let _computedColorStops =  [{
        offset: 0,
        color: GAUGE_ERROR_COLOR
    }]

    if(colorRange[1] < value) {
        _computedColorStops.push({
            offset: (colorRange[1] - colorRange[0]) / (value - colorRange[0]),
            color: GAUGE_WARN_COLOR
        })
    }else {
        _computedColorStops.push({
            offset: 1,
            color: GAUGE_WARN_COLOR
        })

        return _computedColorStops
    }

    if(colorRange[2] < value) {
        _computedColorStops.push({
            offset: ((colorRange[1] + colorRange[2])/2 - colorRange[0]) / (value - colorRange[0]),
            color: GAUGE_GOOD_COLOR
        })
        _computedColorStops.push({
            offset: (colorRange[2] - colorRange[0]) / (value - colorRange[0]),
            color: GAUGE_WARN_COLOR
        })
        _computedColorStops.push({
            offset: 1,
            color: GAUGE_ERROR_COLOR
        })
        return _computedColorStops
    }else {
        _computedColorStops.push({
            offset: 1,
            color: GAUGE_GOOD_COLOR
        })

        return _computedColorStops
    }
}

export function makeProgressGradient(colorRange: number[], value: number) {

    return {
        color: {
            type: 'linear',
            // 수학시간의 2차원 평면 좌표계에서 라인을 그리는 것으로 방향을 정한다. max 값 대비 value 를 알면 대충의 그라디언트 기울기를 구할 수 있다.
            // x: 0, y: 1, x2: 1, y2: 0,
            ...calcTwoPointDiagonal(colorRange[colorRange.length - 1], colorRange[0], value),
            colorStops: calcProgressGradient(colorRange, value),
            global: false // default is false
        }
    }
}




const LocalStorageKey = "croft-dashboard"

export function saveToLS(key, value) {

    if (window.localStorage) {
        let oldData = window.localStorage.getItem(LocalStorageKey)
        if(!oldData) {
            oldData = {}
        }else {
            oldData = JSON.parse(oldData)
        }

        oldData[key] = value

        window.localStorage.setItem(
            LocalStorageKey,
            JSON.stringify(oldData)
        );
    }
}

export function loadFromLS(key) {

    console.log("loadFromLS", key)
    if (window.localStorage) {
        try {
            let oldData = window.localStorage.getItem(LocalStorageKey)
            if(!oldData) {
                oldData = {}
            }else {
                oldData = JSON.parse(oldData)
            }

            return oldData[key];
        } catch (e) {
            return undefined
        }
    }else {
        console.error("window.localStorage is not available")
    }
}



export function calcVPD(temperature: number, humidity: number ) {
    const _temp = temperature || 0
    const _humid = humidity || 0

    const _vpd = (610.7 * Math.pow(10, (7.5 * _temp) / (237.3 + _temp))) / 1000 * (1 - _humid / 100)

    return _vpd
}

export function useForceUpdate(): [() => void, number]{
    const [value, setValue] = useState(0); // integer state
    return [() => setValue(value => value + 1), value]; // update state to force render
}


export function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


export function formatDate(date :Date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so +1 is needed
    const dd = String(date.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
}

interface DateRange {
    fromDate: string;
    toDate: string;
}

export function defaultDateRange(): DateRange  {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 6)

    return {fromDate: formatDate(weekAgo), toDate: formatDate(today)}
}