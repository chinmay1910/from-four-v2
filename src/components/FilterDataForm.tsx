// WOForm.tsx

import React, { useState, useEffect } from 'react';
import { Button } from "../common/Button";
import FLabel from './FLabel';
import { Label } from '../common/Label';
import { RadioCardGroup, RadioCardIndicator, RadioCardItem } from '../common/RadioCardGroup';
import { Badge } from '../common/Badge';
// If @tremor/react has individual DatePicker components, you can import them here.
// Otherwise, we'll use standard HTML date inputs.

interface WOFormProps {
  initialData?: Task;
  onSubmit: (formData: Task) => void;
  workTypes: { value: string; label: string }[];
  priorities: { value: string; label: string }[];
  users: { value: string; label: string }[];
  onClose: () => void; // Add this new prop
}

const FilterDataForm: React.FC<WOFormProps> = ({ initialData, onSubmit, workTypes, priorities, users, onClose }) => {
  const [formData, setFormData] = useState<Task>(initialData || {
    title: '',
    description: '',
    workType: '',
    priority: '',
    assignee: '',
    dueDate: {
      start: '',
      end: '',
    },
    workOrderNumber: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  // Handlers for separate date fields
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      dueDate: {
        ...prevData.dueDate,
        start: value,
      },
    }));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      dueDate: {
        ...prevData.dueDate,
        end: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
    onSubmit(formData);
    console.log("onSubmit called");
    onClose();
    console.log("onClose called");
  };


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

  return (
    <div>
      <FLabel id={"filtername"} label={"Filter Name"} placeholder=" " />
      <form>
        <fieldset className="space-y-3 my-4">
        <Label htmlFor="database" className="font-medium my-1 ml-1">
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
                        <span className="leading-6 dark:text-slate-100 font-bold">{database.label}</span>
                        <Badge>Recommended</Badge>
                      </div>
                    ) : (
                      <span className="leading-6  dark:text-slate-100 font-bold">{database.label}</span>
                    )}
                    <p className="mt-1 text-xs  dark:text-slate-400 text-gray-500">
                      {database.description}
                    </p>
                  </div>
                </div>
              </RadioCardItem>
            ))}
          </RadioCardGroup>
          <fieldset className="space-y-3"></fieldset>
          <Label htmlFor="database" className="font-medium my-1 ml-1">
            Filter Configuration
          </Label>
          <div className="flex flex-row gap-5">
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
        <div className="flex items-center justify-between">
          <Button
            className="mt-4"
            type=""
            variant="primary"
            onClick={() => setSelectedOption("base-performance")}
          >
            Filter Data
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
  );
};

export default FilterDataForm;
