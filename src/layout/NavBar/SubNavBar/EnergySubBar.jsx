import { useState, useEffect } from 'react';
import GlobalReportCalendar from '../../../component/utils/DatePicker/GlobalReportCalendar';
import { useChartData } from '../../../component/utils/api/Charts/ChartAPI';

const EnergySubBar = ({
  type,
  setContainer,
  container,
  selectedDate,
  setSelectedDate,
}) => {
    return (
        <div className="w-full h-[45px] pl-[29px] pt-[4px] flex items-center cursor-pointer select-none border-b-[1px] border-base400 bg-base200">
            <div className="text-lg font-bold mr-[17px]">에너지 사용량</div>
        </div>
    );
};

export default EnergySubBar;
