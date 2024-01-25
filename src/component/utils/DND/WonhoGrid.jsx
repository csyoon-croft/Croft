import React, { useState, useEffect } from "react";
import GridLayout from "react-grid-layout";
import GridData from "./GridData";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import CroftGuide from "../../Charts/CroftGuide/CroftGuide";

const WonhoGrid = () => {
  const [wonhoGridData, setWonhoGridData] = useState([]);
  const [editMode, setEditMode] = useState(false); // 수정 모드 상태
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    setWonhoGridData((prevData) =>
      prevData.map((item) => {
        if (item.id === 2) {
          return {
            ...item,
            layout: { ...item.layout, h: showDetail ? 5 : 2 },
          };
        }
        return item;
      })
    );
  }, [showDetail]);

  useEffect(() => {
    const storedData = localStorage.getItem("checkedItems");
    if (storedData) {
      const storedDataArray = JSON.parse(storedData);
      const filteredGridData = GridData.filter((item) =>
        storedDataArray.includes(item.chartID)
      ).map((item) => item.id);
      setWonhoGridData(
        GridData.filter((item) => filteredGridData.includes(item.id))
      ); // 로컬 스토리지에 따라 뿌려주기
      // } else {
      //   setWonhoGridData(
      //     GridData.filter((item) =>
      //       [
      //         0,
      //         1,
      //         2,
      //         3,
      //         4,
      //         5,
      //         6,
      //         7,
      //         8,
      //         9,
      //         10,
      //         11,
      //         12,
      //         13,
      //         14,
      //         15,
      //         16,
      //         17,
      //         18, // 보여야하는 차트의 ID 값
      //       ].includes(item.id)
      //     )
      //   );
    }
    // console.log(wonhoGridData);
  }, []); // 여기

  const calculateLayoutForComponent = (item) => {
    return {
      i: item.id.toString(), // 여기에서 id를 문자열로 변환
      x: item.layout.x,
      y: item.layout.y,
      w: item.layout.w,
      h: item.layout.h,
      isResizable: true,
    };
  };

  const [layout, setLayout] = useState(() =>
    GridData.map((item) => calculateLayoutForComponent(item))
  );
  const [chartInstances, setChartInstances] = useState({});

  const onLayoutChange = (newLayout) => {
    if (JSON.stringify(newLayout) !== JSON.stringify(layout)) {
      // 새로운 레이아웃으로 상태 업데이트
      setLayout(newLayout);

      // wonhoGridData도 새로운 레이아웃으로 업데이트
      const updatedWonhoGridData = wonhoGridData.map((item) => {
        const newItemLayout = newLayout.find(
          (layoutItem) => layoutItem.i === item.id.toString()
        );
        return newItemLayout ? { ...item, layout: newItemLayout } : item;
      });

      setWonhoGridData(updatedWonhoGridData);
    }

    Object.values(chartInstances).forEach((chart) => chart.resize());
  };

  const registerChart = (key, instance) => {
    setChartInstances((prev) => ({ ...prev, [key]: instance }));
  };

  const toggleEditMode = () => {
    setEditMode(!editMode); // 수정 모드 토글
  };

  return (
    <>
      <button onClick={toggleEditMode}>
        {editMode ? "수정 완료" : "레이아웃 수정"}
      </button>
      {/* <TotalResourceChart /> */}
      <GridLayout
        className="layout select-none" // 여기에 select-none 클래스 추가
        cols={10}
        rowHeight={100}
        width={1660}
        onLayoutChange={onLayoutChange}
        isDraggable={editMode}
        isResizable={editMode} // 전체 레이아웃에 대한 isResizable 설정
      >
        {wonhoGridData.map((item) => (
          <div
            key={item.id.toString()}
            data-grid={{ ...item.layout, isResizable: editMode }}
          >
            {item.id === 2 ? (
              <CroftGuide
                showDetail={showDetail}
                setShowDetail={setShowDetail}
                // 다른 필요한 props
              />
            ) : (
              React.cloneElement(item.component, {
                registerChart: registerChart,
                chartKey: item.id.toString(),
                layout: item.layout,
              })
            )}
          </div>
        ))}
      </GridLayout>
    </>
  );
};

export default WonhoGrid;
