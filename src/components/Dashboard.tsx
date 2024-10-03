
import { useState } from "react";
import AssetProfile from "./tabs/asset_profile/AssetProfile";
import TrendAnalysis from "./tabs/trend_analysis/TrendAnalysis";

import DataTransformation from "./tabs/data_transform/DataTransformation";
import FeatureExtraction from "./FeatureExtraction";
import ConditionAssessment from "./ConditionAssessment";
import { FiPhone } from "react-icons/fi";
import { Callout } from "../common/Callout";
import { RiErrorWarningFill } from '@remixicon/react';
import { TrendingUp, GitCompareArrows, TriangleAlert, Sigma, Gauge } from "lucide-react";

import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { DateRangePicker, DateRange } from "../common/DatePicker";
import React from "react";
import Marquee from "../common/Marquee";





const Dashboard = () => {

  const [activeTab, setActiveTab] = useState(0);

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    undefined,
  )

  const tabs = [
    { name: "Asset Profile", icon: Gauge },
    { name: "Trend Analysis", icon: TrendingUp },
    { name: "Data Transform", icon: Sigma },
    { name: "Feature Extraction", icon: GitCompareArrows },
    { name: "Rule Based Alerts", icon: TriangleAlert },
  ];



  const presets = [
    {
      label: "Today",
      dateRange: {
        from: new Date(),
        to: new Date(),
      },
    },
    {
      label: "Last 7 days",
      dateRange: {
        from: new Date(new Date().setDate(new Date().getDate() - 7)),
        to: new Date(),
      },
    },
    {
      label: "Last 30 days",
      dateRange: {
        from: new Date(new Date().setDate(new Date().getDate() - 30)),
        to: new Date(),
      },
    },
    {
      label: "Last 3 months",
      dateRange: {
        from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
        to: new Date(),
      },
    },
    {
      label: "Last 6 months",
      dateRange: {
        from: new Date(new Date().setMonth(new Date().getMonth() - 6)),
        to: new Date(),
      },
    },
    {
      label: "Month to date",
      dateRange: {
        from: new Date(new Date().setDate(1)),
        to: new Date(),
      },
    },
    {
      label: "Year to date",
      dateRange: {
        from: new Date(new Date().setFullYear(new Date().getFullYear(), 0, 1)),
        to: new Date(),
      },
    },
  ]


  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className="">
      <div className="flex w-full h-full overflow-hidden">
        <div className="flex flex-col gap-1 ml-2 mt-4 mb-6 w-[40%]">
          <div className="flex gap-3 align-end items-end pt-1">
            <h3 className=" font-semibold  text-gray-900 dark:text-gray-50 text-3xl">
              Asset Name
            </h3>
            <Badge className="mb-1" variant="warning">Warning</Badge>
          </div>

          <div className="flex gap-10 mt-1">
            <p className=" flex justify-center items-center gap-2 text-slate-500 dark:text-slate-400">
              Location, Factory Name</p>
            <p className=" flex justify-center items-center gap-2 text-slate-500 dark:text-slate-400"><FiPhone />
              Mr. Chinmay</p>
          </div>
        </div>
        <div className="flex-col flex-grow justify-items-start ">
          <div className="mb-2.5 mx-2">
            <div>
              <Marquee speed={35}>
                <Callout
                  variant="warning"
                  className="py-2 px-3"
                  title="High Vibration Alert: Suspected Dynamic Imbalance in NDE"
                  icon={RiErrorWarningFill}
                />
              </Marquee>

            </div>


          </div>
          <div>
            <div className="tab-list flex  gap-3 my-2">
              {tabs.map((tab, index) => (
                <Button
                  variant="ghost"
                  key={index}
                  className={`tab-button  text-slate-500 hover:bg-gray-200 hover:text-slate-800 text-base dark:hover:bg-slate-700 dark:hover:text-slate-100 flex items-center gap-2 ${activeTab === index ? "bg-gray-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700" : ""
                    }`}
                  onClick={() => handleTabClick(index)}
                >
                  <tab.icon size={18} />
                  {tab.name}
                </Button>
              ))}

              <div className="flex flex-col items-center gap-y-4">
                <DateRangePicker
                  presets={presets}
                  value={dateRange}
                  onChange={setDateRange}
                  className="w-60"
                />

                {/* <p className="flex items-center rounded-md bg-gray-100 p-2 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-300">
                  Selected Range:{" "}
                  {dateRange
                    ? `${dateRange.from?.toLocaleDateString()} – ${dateRange.to?.toLocaleDateString() ?? ""}`
                    : "None"}
                </p> */}
              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="flex-1">
        <div className="w-full ">
          <div className="">
            <div className="tab-content overflow-y-auto scrollbar">
              {activeTab === 0 && <div><AssetProfile /></div>}
              {activeTab === 1 && <div><TrendAnalysis /></div>}
              {activeTab === 2 && <div><DataTransformation /></div>}
              {activeTab === 3 && <div><FeatureExtraction /></div>}
              {activeTab === 4 && <div><ConditionAssessment /></div>}
            </div>

            <div className="flex-grow">
              <div className="flex gap-5">
                <div className="mx-auto flex max-w-lg items-center justify-between px-4 ">
                  <div className="flex items-center space-x-2.5">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div>

            </div>
            <div>

            </div>
          </div>


        </div>
      </div>
    </div>

  );
};

export default Dashboard;
