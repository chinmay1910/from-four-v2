import { Card, } from "../../../common/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../Tabs"
import WorkinProgress from '../.././../assets/work.png'
import { AreaChart } from "../../../common/AreaChart";

import { Badge } from "../../../common/Badge";
import { Button } from "../../../common/Button";
import { Label } from "../../../common/Label";
import React from "react";

import { useState, useCallback } from "react";
import {
  RadioCardGroup,
  RadioCardIndicator,
  RadioCardItem,
} from "../../../common/RadioCardGroup";
import FLabel from "../../FLabel";
import { FiUploadCloud } from "react-icons/fi";




interface InputValues {
  [key: string]: number;
}




function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const data = [
  { date: 'Jan 23', Organic: 232, Sponsored: 0, Affiliate: 49, }, { date: 'Feb 23', Organic: 241, Sponsored: 0, Affiliate: 61, }, { date: 'Mar 23', Organic: 291, Sponsored: 0, Affiliate: 55, }, { date: 'Apr 23', Organic: 101, Sponsored: 0, Affiliate: 21, }, { date: 'May 23', Organic: 318, Sponsored: 0, Affiliate: 66, }, { date: 'Jun 23', Organic: 205, Sponsored: 0, Affiliate: 69, }, { date: 'Jul 23', Organic: 372, Sponsored: 0, Affiliate: 55, }, { date: 'Aug 23', Organic: 341, Sponsored: 0, Affiliate: 74, }, { date: 'Sep 23', Organic: 387, Sponsored: 120, Affiliate: 190, }, { date: 'Oct 23', Organic: 220, Sponsored: 0, Affiliate: 89, }, { date: 'Nov 23', Organic: 372, Sponsored: 0, Affiliate: 44, }, { date: 'Dec 23', Organic: 321, Sponsored: 0, Affiliate: 93, },
];

const summary = [
  { name: 'Organic', value: 3273, }, { name: 'Sponsored', value: 120, }, { name: 'Affiliate', value: 866, },
];

const valueFormatter = (number) =>
  `${Intl.NumberFormat('us').format(number).toString()}`;

const statusColor = {
  Organic: 'bg-blue-500',
  Sponsored: 'bg-violet-500',
  Affiliate: 'bg-fuchsia-500',
};

const data1 = [
  {
    date: 'Aug 01',
    'ETF Shares Vital': 2100.2,
    'Vitainvest Core': 4434.1,
    'iShares Tech Growth': 7943.2,
  },
  {
    date: 'Aug 02',
    'ETF Shares Vital': 2943.0,
    'Vitainvest Core': 4954.1,
    'iShares Tech Growth': 8954.1,
  },
  {
    date: 'Aug 03',
    'ETF Shares Vital': 4889.5,
    'Vitainvest Core': 6100.2,
    'iShares Tech Growth': 9123.7,
  },
  {
    date: 'Aug 04',
    'ETF Shares Vital': 3909.8,
    'Vitainvest Core': 4909.7,
    'iShares Tech Growth': 7478.4,
  },
  {
    date: 'Aug 05',
    'ETF Shares Vital': 5778.7,
    'Vitainvest Core': 7103.1,
    'iShares Tech Growth': 9504.3,
  },
  {
    date: 'Aug 06',
    'ETF Shares Vital': 5900.9,
    'Vitainvest Core': 7534.3,
    'iShares Tech Growth': 9943.4,
  },
  {
    date: 'Aug 07',
    'ETF Shares Vital': 4129.4,
    'Vitainvest Core': 7412.1,
    'iShares Tech Growth': 10112.2,
  },
  {
    date: 'Aug 08',
    'ETF Shares Vital': 6021.2,
    'Vitainvest Core': 7834.4,
    'iShares Tech Growth': 10290.2,
  },
  {
    date: 'Aug 09',
    'ETF Shares Vital': 6279.8,
    'Vitainvest Core': 8159.1,
    'iShares Tech Growth': 10349.6,
  },
  {
    date: 'Aug 10',
    'ETF Shares Vital': 6224.5,
    'Vitainvest Core': 8260.6,
    'iShares Tech Growth': 10415.4,
  },
  {
    date: 'Aug 11',
    'ETF Shares Vital': 6380.6,
    'Vitainvest Core': 8965.3,
    'iShares Tech Growth': 10636.3,
  },
  {
    date: 'Aug 12',
    'ETF Shares Vital': 6414.4,
    'Vitainvest Core': 7989.3,
    'iShares Tech Growth': 10900.5,
  },
  {
    date: 'Aug 13',
    'ETF Shares Vital': 6540.1,
    'Vitainvest Core': 7839.6,
    'iShares Tech Growth': 11040.4,
  },
  {
    date: 'Aug 14',
    'ETF Shares Vital': 6634.4,
    'Vitainvest Core': 7343.8,
    'iShares Tech Growth': 11390.5,
  },
  {
    date: 'Aug 15',
    'ETF Shares Vital': 7124.6,
    'Vitainvest Core': 6903.7,
    'iShares Tech Growth': 11423.1,
  },
  {
    date: 'Aug 16',
    'ETF Shares Vital': 7934.5,
    'Vitainvest Core': 6273.6,
    'iShares Tech Growth': 12134.4,
  },
  {
    date: 'Aug 17',
    'ETF Shares Vital': 10287.8,
    'Vitainvest Core': 5900.3,
    'iShares Tech Growth': 12034.4,
  },
  {
    date: 'Aug 18',
    'ETF Shares Vital': 10323.2,
    'Vitainvest Core': 5732.1,
    'iShares Tech Growth': 11011.7,
  },
  {
    date: 'Aug 19',
    'ETF Shares Vital': 10511.4,
    'Vitainvest Core': 5523.1,
    'iShares Tech Growth': 11834.8,
  },
  {
    date: 'Aug 20',
    'ETF Shares Vital': 11043.9,
    'Vitainvest Core': 5422.3,
    'iShares Tech Growth': 12387.1,
  },
  {
    date: 'Aug 21',
    'ETF Shares Vital': 6700.7,
    'Vitainvest Core': 5334.2,
    'iShares Tech Growth': 11032.2,
  },
  {
    date: 'Aug 22',
    'ETF Shares Vital': 6900.8,
    'Vitainvest Core': 4943.4,
    'iShares Tech Growth': 10134.2,
  },
  {
    date: 'Aug 23',
    'ETF Shares Vital': 7934.5,
    'Vitainvest Core': 4812.1,
    'iShares Tech Growth': 9921.2,
  },
  {
    date: 'Aug 24',
    'ETF Shares Vital': 9021.0,
    'Vitainvest Core': 2729.1,
    'iShares Tech Growth': 10549.8,
  },
  {
    date: 'Aug 25',
    'ETF Shares Vital': 9198.2,
    'Vitainvest Core': 2178.0,
    'iShares Tech Growth': 10968.4,
  },
  {
    date: 'Aug 26',
    'ETF Shares Vital': 9557.1,
    'Vitainvest Core': 2158.3,
    'iShares Tech Growth': 11059.1,
  },
  {
    date: 'Aug 27',
    'ETF Shares Vital': 9959.8,
    'Vitainvest Core': 2100.8,
    'iShares Tech Growth': 11903.6,
  },
  {
    date: 'Aug 28',
    'ETF Shares Vital': 10034.6,
    'Vitainvest Core': 2934.4,
    'iShares Tech Growth': 12143.3,
  },
  {
    date: 'Aug 29',
    'ETF Shares Vital': 10243.8,
    'Vitainvest Core': 3223.4,
    'iShares Tech Growth': 12930.1,
  },
  {
    date: 'Aug 30',
    'ETF Shares Vital': 10078.5,
    'Vitainvest Core': 3779.1,
    'iShares Tech Growth': 13420.5,
  },
  {
    date: 'Aug 31',
    'ETF Shares Vital': 11134.6,
    'Vitainvest Core': 4190.3,
    'iShares Tech Growth': 14443.2,
  },
  {
    date: 'Sep 01',
    'ETF Shares Vital': 12347.2,
    'Vitainvest Core': 4839.1,
    'iShares Tech Growth': 14532.1,
  },
  {
    date: 'Sep 02',
    'ETF Shares Vital': 12593.8,
    'Vitainvest Core': 5153.3,
    'iShares Tech Growth': 14283.5,
  },
  {
    date: 'Sep 03',
    'ETF Shares Vital': 12043.4,
    'Vitainvest Core': 5234.8,
    'iShares Tech Growth': 14078.9,
  },
  {
    date: 'Sep 04',
    'ETF Shares Vital': 12144.9,
    'Vitainvest Core': 5478.4,
    'iShares Tech Growth': 13859.7,
  },
  {
    date: 'Sep 05',
    'ETF Shares Vital': 12489.5,
    'Vitainvest Core': 5741.1,
    'iShares Tech Growth': 13539.2,
  },
  {
    date: 'Sep 06',
    'ETF Shares Vital': 12748.7,
    'Vitainvest Core': 6743.9,
    'iShares Tech Growth': 13643.2,
  },
  {
    date: 'Sep 07',
    'ETF Shares Vital': 12933.2,
    'Vitainvest Core': 7832.8,
    'iShares Tech Growth': 14629.2,
  },
  {
    date: 'Sep 08',
    'ETF Shares Vital': 13028.8,
    'Vitainvest Core': 8943.2,
    'iShares Tech Growth': 13611.2,
  },
  {
    date: 'Sep 09',
    'ETF Shares Vital': 13412.4,
    'Vitainvest Core': 9932.2,
    'iShares Tech Growth': 12515.2,
  },
  {
    date: 'Sep 10',
    'ETF Shares Vital': 13649.0,
    'Vitainvest Core': 10139.2,
    'iShares Tech Growth': 11143.8,
  },
  {
    date: 'Sep 11',
    'ETF Shares Vital': 13748.5,
    'Vitainvest Core': 10441.2,
    'iShares Tech Growth': 8929.2,
  },
  {
    date: 'Sep 12',
    'ETF Shares Vital': 13148.1,
    'Vitainvest Core': 10933.8,
    'iShares Tech Growth': 8943.2,
  },
  {
    date: 'Sep 13',
    'ETF Shares Vital': 12839.6,
    'Vitainvest Core': 11073.4,
    'iShares Tech Growth': 7938.3,
  },
  {
    date: 'Sep 14',
    'ETF Shares Vital': 12428.2,
    'Vitainvest Core': 11128.3,
    'iShares Tech Growth': 7533.4,
  },
  {
    date: 'Sep 15',
    'ETF Shares Vital': 12012.8,
    'Vitainvest Core': 11412.3,
    'iShares Tech Growth': 7100.4,
  },
  {
    date: 'Sep 16',
    'ETF Shares Vital': 11801.3,
    'Vitainvest Core': 10501.1,
    'iShares Tech Growth': 6532.1,
  },
  {
    date: 'Sep 17',
    'ETF Shares Vital': 10102.9,
    'Vitainvest Core': 8923.3,
    'iShares Tech Growth': 4332.8,
  },
  {
    date: 'Sep 18',
    'ETF Shares Vital': 12132.5,
    'Vitainvest Core': 10212.1,
    'iShares Tech Growth': 7847.4,
  },
  {
    date: 'Sep 19',
    'ETF Shares Vital': 12901.1,
    'Vitainvest Core': 10101.7,
    'iShares Tech Growth': 7223.3,
  },
  {
    date: 'Sep 20',
    'ETF Shares Vital': 13132.6,
    'Vitainvest Core': 12132.3,
    'iShares Tech Growth': 6900.2,
  },
  {
    date: 'Sep 21',
    'ETF Shares Vital': 14132.2,
    'Vitainvest Core': 13212.5,
    'iShares Tech Growth': 5932.2,
  },
  {
    date: 'Sep 22',
    'ETF Shares Vital': 14245.8,
    'Vitainvest Core': 12163.4,
    'iShares Tech Growth': 5577.1,
  },
  {
    date: 'Sep 23',
    'ETF Shares Vital': 14328.3,
    'Vitainvest Core': 10036.1,
    'iShares Tech Growth': 5439.2,
  },
  {
    date: 'Sep 24',
    'ETF Shares Vital': 14949.9,
    'Vitainvest Core': 8985.1,
    'iShares Tech Growth': 4463.1,
  },
  {
    date: 'Sep 25',
    'ETF Shares Vital': 15967.5,
    'Vitainvest Core': 9700.1,
    'iShares Tech Growth': 4123.2,
  },
  {
    date: 'Sep 26',
    'ETF Shares Vital': 17349.3,
    'Vitainvest Core': 10943.4,
    'iShares Tech Growth': 3935.1,
  },
];

const summary1 = [
  {
    name: 'ETF Shares Vital',
    value: '$21,349.36',
    invested: '$19,698.65',
    cashflow: '$14,033.74',
    gain: '+$11,012.39',
    realized: '+$177.48',
    dividends: '+$490.97',
    bgColor: 'bg-blue-500',
    changeType: 'positive',
  },
  {
    name: 'Vitainvest Core',
    value: '$25,943.43',
    invested: '$23,698.65',
    cashflow: '$11,033.74',
    gain: '+$3,012.39',
    realized: '+$565.41',
    dividends: '+$290.97',
    bgColor: 'bg-violet-500',
    changeType: 'positive',
  },
  {
    name: 'iShares Tech Growth',
    value: '$9,443.46',
    invested: '$14,698.65',
    cashflow: '$2,033.74',
    gain: '-$5,012.39',
    realized: '-$634.42',
    dividends: '-$990.97',
    bgColor: 'bg-fuchsia-500',
    changeType: 'negative',
  },
];

const chartdata = [
  {
    date: "Jan 23",
    SolarPanels: 2890,
    Inverters: 2338,
  },
  {
    date: "Feb 23",
    SolarPanels: 2756,
    Inverters: 2103,
  },
  {
    date: "Mar 23",
    SolarPanels: 3322,
    Inverters: 2194,
  },
  {
    date: "Apr 23",
    SolarPanels: 3470,
    Inverters: 2108,
  },
  {
    date: "May 23",
    SolarPanels: 3475,
    Inverters: 1812,
  },
  {
    date: "Jun 23",
    SolarPanels: 3129,
    Inverters: 1726,
  },
  {
    date: "Jul 23",
    SolarPanels: 3490,
    Inverters: 1982,
  },
  {
    date: "Aug 23",
    SolarPanels: 2903,
    Inverters: 2012,
  },
  {
    date: "Sep 23",
    SolarPanels: 2643,
    Inverters: 2342,
  },
  {
    date: "Oct 23",
    SolarPanels: 2837,
    Inverters: 2473,
  },
  {
    date: "Nov 23",
    SolarPanels: 2954,
    Inverters: 3848,
  },
  {
    date: "Dec 23",
    SolarPanels: 3239,
    Inverters: 3736,
  },
]

const FilterForm = () => {
  const [data, setData] = useState([]); // Add state for uploaded data
  const fileInputRef = React.useRef<HTMLInputElement | null>(null); // Create a ref for the file input

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const lines = content.split('\n');
        const parsedData = lines
          .filter(line => line.trim() !== '')
          .map((line, index) => {
            const [x, y, z] = line.split(/\s+/).map(value => {
              const num = Number(value);
              return num === 0 ? 0.0001 : num;
            });
            return { frequency: index, x, y, z };
          });
        setData(parsedData); // Update state with parsed data
      };
      reader.readAsText(file);
    }
  }, []);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click(); // Trigger file input click
  }, []);

  const [selectedOption, setSelectedOption] = React.useState("base-performance")

  const databases: {
    label: string
    value: string
    description: string
    isRecommended: boolean
  }[] = [
      {
        label: "Low Pass Filter",
        value: "low-pass-filter",
        description: "Remove high frequency noise.",
        isRecommended: true,
      },
      {
        label: "High Pass Filter",
        value: "high-pass-filter",
        description: "Remove low frequency content.",
        isRecommended: false,
      },
      {
        label: "Band Pass Filter ",
        value: "band-pass-filter",
        description: "Create a pass band for analysis.",
        isRecommended: false,
      },
    ]

  const [inputValues, setInputValues] = useState<InputValues>({
    order: 1,
    cutIn: 1,
    cutOut: 1,
  });

  const handleInputChange = (id: string) => (value: number | string) => {
    if (typeof value === 'number') {
      setInputValues(prevValues => ({
        ...prevValues,
        [id]: value
      }));
    }
  };

  const [visibleAxes, setVisibleAxes] = useState<{ [key: string]: boolean }>({
    x: true,
    y: true,
    z: true,
  });

  const toggleAxisVisibility = (axis: string) => {
    setVisibleAxes(prev => ({ ...prev, [axis]: !prev[axis] }));
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef} // Attach ref to the file input
        onChange={handleFileUpload}
        className="hidden" // Hide the file input
      />


      <div className="flex gap-4">
        <div className="w-[70%]">
          <Card>
            <div className="flex fle-col gap-4 ">
              <h5 className="mb-3 ml-2">
                Pre-Process Data
              </h5>
              <Button variant='light' onClick={handleUploadClick}>
                <p className='flex items-center gap-2'><FiUploadCloud />Upload File</p>
              </Button>
              <div className='flex gap-5 ml-7'>
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  {(['x', 'y', 'z'] as Axis[]).map((axis) => (
                    <button
                      key={axis}
                      type="button"
                      onClick={() => toggleAxisVisibility(axis)}
                      className={`px-4 py-2 text-sm font-medium border ${visibleAxes[axis]
                        ? 'bg-slate-50 text-slate-900 border-slate-200 hover:bg-slate-100 hover:text-slate-1000 dark:bg-slate-900 dark:text-slate-100 dark:border-none dark:hover:bg-slate-900 dark:hover:text-slate-50'
                        : 'bg-white text-slate-300 border-gray-200 hover:bg-gray-50 hover:text-gray-600 dark:bg-transparent dark:text-slate-400 dark:border-none dark:hover:bg-slate-900 dark:hover:text-slate-300'
                        } ${axis === 'x' ? 'rounded-l-lg' : axis === 'z' ? 'rounded-r-lg' : ''}`}
                    >
                      {axis.toUpperCase()}-Axis
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="ml-2 mt-4">
              <div
                className="space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-500"
              >

                <AreaChart
                  data={data1}
                  index="date"
                  categories={[
                    'ETF Shares Vital',
                    'Vitainvest Core',
                    'iShares Tech Growth',
                  ]}
                  colors={['blue', 'violet', 'fuchsia']}
                  valueFormatter={valueFormatter}
                  yAxisWidth={60}
                  onValueChange={() => { }}
                  className="mt-6 hidden h-96 sm:block"
                  showLegend={true}
                  legendProps={{
                    className: "mt-3",
                    position: "top"
                  }}
                />
                <AreaChart
                  data={data1}
                  index="date"
                  categories={[
                    'ETF Shares Vital',
                    'Vitainvest Core',
                    'iShares Tech Growth',
                  ]}
                  colors={['blue', 'violet', 'fuchsia']}
                  valueFormatter={valueFormatter}
                  showYAxis={false}
                  showLegend={true}

                  startEndOnly={true}
                  className="mt-6 h-72 sm:hidden"
                />



              </div>

            </div>


          </Card>
        </div>
        <div className="w-[30%]">
          <Card className="h-full">
            <h5 className="mb-3 ml-2">
              Filter Data
            </h5>
            <Tabs className="h-100" defaultValue="tab1">
              <TabsList variant="solid">
                <TabsTrigger value="tab1">IIR Filters</TabsTrigger>
                <TabsTrigger value="tab2">FIR Filters</TabsTrigger>
                <TabsTrigger value="tab3">Misc. Filters</TabsTrigger>
              </TabsList>
              <div className="ml-2 mt-4">
                <TabsContent
                  value="tab1"
                  className="space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-500"
                >
                  <div className="">


                    <div className="flex flex-col gap-4">
                      <FLabel id={"filtername"} label={"Filter Name"} placeholder=" " />
                      <form>
                        <fieldset className="space-y-3">
                          <Label htmlFor="database" className="font-medium mb-1">
                            Select Type of Filter
                          </Label>
                          <RadioCardGroup
                            value={selectedOption}
                            onValueChange={(value) => setSelectedOption(value)}
                            className="mt-2 grid grid-cols-1 gap-3 text-sm "
                          >
                            {databases.map((database) => (
                              <RadioCardItem className="  hover:bg-slate-100 dark:hover:bg-slate-900" key={database.value} value={database.value}>
                                <div className="flex items-start gap-3">
                                  <RadioCardIndicator className="mt-1" />
                                  <div>
                                    {database.isRecommended ? (
                                      <div className="flex items-center gap-2">
                                        <span className="leading-6  font-bold">{database.label}</span>
                                        <Badge>Recommended</Badge>
                                      </div>
                                    ) : (
                                      <span className="leading-6  font-bold">{database.label}</span>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500">
                                      {database.description}
                                    </p>
                                  </div>
                                </div>
                              </RadioCardItem>
                            ))}
                          </RadioCardGroup>
                          <fieldset className="space-y-3"></fieldset>
                          <Label htmlFor="database" className="font-medium my-1">
                            Filter Configuration
                          </Label>
                          <div className="flex flex-row gap-4">
                            {/* <SelectNative id="selectNumber" className="rounded-lg w-[80px] p-3">
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                            </SelectNative> */}


                            <div className="basis-1/3">
                              <FLabel
                                id="order"
                                label="Filter Order"
                                type="number"
                                min={1}
                                max={5}
                                value={inputValues.order}
                                onChange={handleInputChange("order")}
                              />
                            </div>
                            <div className="w-1/3">
                              <FLabel
                                id="cutIn"
                                label="Cut-in Freq"
                                type="number"
                                min={0}
                                max={10000}
                                value={inputValues.cutIn}
                                onChange={handleInputChange("cutIn")}
                              />
                            </div>
                            <div className="basis-1/3">
                              <FLabel
                                id="cutOut"
                                label="Cut-out Freq"
                                type="number"
                                min={0}
                                max={10000}
                                value={inputValues.cutOut}
                                onChange={handleInputChange("cutOut")}
                              />
                            </div>
                          </div>

                        </fieldset>
                        <hr className="my-4"></hr>
                        <div className="flex justify-between">
                          <Button
                            className=""
                            type="reset"
                            variant="primary"
                            onClick={() => setSelectedOption("base-performance")}
                          >
                            Compute Filter
                          </Button>

                          <Button
                            className="mt-4"
                            type="reset"
                            variant="ghost"
                            onClick={() => setSelectedOption("base-performance")}
                          >
                            Reset
                          </Button>
                        </div>
                      </form>


                    </div>
                  </div>
                </TabsContent>
                <TabsContent
                  value="tab2"
                  className="space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-500"
                >
                  <div className="  flex items-center justify-center mx-auto my-5">
                    <img className="w-[50%]" src={WorkinProgress} />
                  </div>

                </TabsContent>
                <TabsContent
                  value="tab3"
                  className="space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-500 h-full"
                >
                  <div className=" flex items-center justify-center mx-auto my-auto h-full">
                    <img className="w-[50%]" src={WorkinProgress} />
                  </div>
                </TabsContent>
              </div>
            </Tabs>

          </Card>

        </div>
      </div>

    </div>
  )
}

export default FilterForm