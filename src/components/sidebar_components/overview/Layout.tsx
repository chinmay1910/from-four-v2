// Layout.tsx

import Dashboard from "../../Dashboard";
import TreeUI from "../TreeUI";
import { Input } from "../../../common/Input";
import { Link, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import logo from '../../../assets/logo.svg';
import { ChartPie, LayoutList, FileInput } from "lucide-react";
import { UserProfileDesktop } from "../../UserProfile";
const sampleData = [
  {
    name: "AGCM Sangali (32)",
    children: [
      {
        name: "VSI Crusher A",
        children: [
          { name: "Main Rotor", status: "normal" },
          { name: "Pulley DE", status: "alert" },
          { name: "Motor Housing", status: "normal" },
          { name: "Main Body", status: "alert" },
          { name: "Structure Base", status: "normal" },
          { name: "Hopper Top", status: "alert" },
        ]
      },
      {
        name: "Vibratory Screen",
        children: [
          { name: "RHS Top", status: "warning" },
          { name: "RHS Bottom", status: "offline" },
          { name: "LHS Top", status: "normal" },
          { name: "LHS Bottom", status: "alert" },
          { name: "Base Structure", status: "normal" },
          { name: "Motor Drive", status: "alert" },
        ]
      }
    ]
  },
  {
    name: "AGCM Pune (12)",
    children: [
      {
        name: "Jaw Crusher",
        children: [
          { name: "Asset 3.1", status: "normal" },
          { name: "Asset 3.2", status: "alert" },
          { name: "Asset 1.3", status: "normal" },
          { name: "Asset 1.4", status: "alert" },
          { name: "Asset 1.5", status: "normal" },
          { name: "Asset 1.6", status: "alert" },

        ]
      },
      {
        name: "Cone Crusher",
        children: [
          { name: "Asset 3.1", status: "normal" },
          { name: "Asset 3.2", status: "alert" },
          { name: "Asset 1.3", status: "normal" },
          { name: "Asset 1.4", status: "alert" },
          { name: "Asset 1.5", status: "normal" },
          { name: "Asset 1.6", status: "alert" },

        ]
      },
      {
        name: "VSI Crusher",
        children: [
          { name: "Asset 3.1", status: "normal" },
          { name: "Asset 3.2", status: "alert" },
          { name: "Asset 1.3", status: "normal" },
          { name: "Asset 1.4", status: "alert" },
          { name: "Asset 1.5", status: "normal" },
          { name: "Asset 1.6", status: "alert" },

        ]
      }
    ]
  }
];

const Layout = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50 p-1 dark:bg-slate-950">
      <div className="flex h-full w-full gap-5 overflow-hidden">
        <div className="flex flex-col justify-between h-100 min-w-[290px] overflow-y-auto rounded-xl mt-3 ml-3 mb-3 bg-slate-900">
          <div>
            <div className="mt-4 flex flex-col gap-3 p-6">
              <div className="h-7">
                <img src={logo} className="h-7 mx-auto w-[220px]" alt="Logo" />
              </div>


              <div>
                <hr className="border border-slate-700 mx-3 my-3"></hr>
                <p className="text-teal-200 text-xs py-2 ml-3 mb-1 ">Condition Monitoring</p>
                <Link
                  to="/dashbaord"
                  className={`flex w-full items-center gap-2 rounded-lg px-5 py-2.5 text-left text-sm font-medium text-white hover:bg-slate-800 hover:text-amber-100 ${location.pathname === '/overview' ? 'bg-slate-800 text-amber-100' : ''
                    }`}
                >
                  <ChartPie className="w-4 h-4 "></ChartPie>
                  Overview
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-slate-900"> 2
                  </span>
                </Link>
                <Link
                  to="/workorder"
                  className={`flex w-full items-center gap-2 rounded-lg px-5 py-2.5 text-left text-sm font-medium text-white hover:bg-slate-800 hover:text-amber-100 ${location.pathname === '/work-orders' ? 'bg-slate-800 text-amber-100' : ''
                    }`}
                >
                  <LayoutList className="w-4 h-4 "></LayoutList>
                  Work Orders
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-slate-900"> 2
                  </span>
                </Link>
                <Link
                  to="/reports"
                  className={`flex w-full items-center gap-2 rounded-lg px-5 py-2.5 text-left text-sm font-medium text-white hover:bg-slate-800 hover:text-amber-100 ${location.pathname === '/reports' ? 'bg-slate-800 text-amber-100' : ''
                    }`}
                >
                  <FileInput className="w-4 h-4 "></FileInput>
                  Reports
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-slate-900"> 2
                  </span>
                </Link>
                <hr className="border border-slate-700 mx-3 my-3"></hr>

                <div className="max-w-xs mx-2 mb-2 space-y-2">
                  <Input
                    placeholder="Search Assets.."
                    id="search"
                    name="search"
                    type="search"
                    className="bg-transparent"
                    darkMode={true}
                  />
                </div>
                <p className="text-teal-200 text-xs py-2 ml-3 mb-1 ">Monitored Assets</p>
                <div className="overflow-y-auto max-h-[420px] pr-2 mr-[-16px] scrollbar">

                  <div className="ml-2">
                    <TreeUI data={sampleData} />
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="p-6">
            <UserProfileDesktop />
          </div>
        </div>

        <div className="flex-grow overflow-hidden px-1 py-2 mr-3 rounded-xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
