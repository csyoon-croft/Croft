import { format } from 'date-fns';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useOutletContext } from 'react-router';
import { useReactToPrint } from 'react-to-print';
import DailyReportPage from '../component/Report/DailyReport';
import TotalReport from '../component/Report/TotalReport';
import { TotalReportGreenhouseText as Desc } from '../component/utils/Data/TempData';
import EnergySubBar from '../layout/NavBar/SubNavBar/EnergySubBar';
import { DailyReport } from '../component/utils/Data/TempData';
import { EnergyTempChart, EnergyChart, MonthlyEnergyChart } from '../component/Charts/EnergyCharts/EnergyChart.tsx'
import { useChartData } from '../component/utils/api/Charts/ChartAPI.js';

const SingleEnergyUsage = () => {
  const { container, setContainer } = useOutletContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reportType, setReportType] = useState(true);
  const date = format(selectedDate, 'yyyy.MM.dd');
  const [batch, setBatch] = useState(null);
  const [selectedDayItem, setSelectedDayItem] = useState(null);
  const { data, isLoading } = useChartData(`
    ${process.env.REACT_APP_BASE_API_KEY}/v1/farms/energy/current-monthly-usage`
  );

  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const remainingDays = lastDayOfMonth - today.getDate();

  return (
    <div className="flex flex-col h-full">
      <EnergySubBar
        type="single"
        setContainer={setContainer}
        container={container}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <div className='flex p-10 gap-x-4'>
        <div className={`flex flex-col w-[240px] h-[240px] rounded-[10px] bg-white gap-3`}>
          <div className={`flex justify-center text-lg p-5 font-bold`}>
            이번 달 현재 사용량
          </div>
          <div className={`flex justify-center text-2xl p-5`}>
            {(data?.data[0]?.monthly_rail_energy_usage || 0).toFixed(0)}(₩)
          </div>
        </div>
        <div className={`flex flex-col w-[240px] h-[240px] rounded-[10px] bg-white gap-3`}>
          <div className={`flex justify-center text-lg p-5 font-bold`}>
            이번 달 예상 비용
          </div>
          <div className={`flex justify-center text-2xl p-5`}>
            {((data?.data[0]?.monthly_rail_energy_usage / today.getDate() * lastDayOfMonth) || 0).toFixed(0)}(₩)
          </div>
        </div>
      </div>
      <div className='flex flex-col p-10 gap-y-4'>
        <div className="font-bold text-2xl">온실 환경</div>
        <div className="relative col-span-5 bg-white rounded p-40">
          <div className={"flex flex-col h-full"}>
            <EnergyTempChart period={"daily"}/>
          </div>
        </div>
        <div className="font-bold text-2xl">일별 예상 비용</div>
        <div className="relative col-span-5 bg-white rounded p-40">
          <div className={"flex flex-col h-full"}>
            <EnergyChart period={"daily"}/>
          </div>
        </div>
        <div className="font-bold text-2xl">월별 예상 비용</div>
        <div className="relative col-span-5 bg-white rounded p-40">
          <div className={"flex flex-col h-full"}>
            <MonthlyEnergyChart period={"monthly"}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleEnergyUsage;
