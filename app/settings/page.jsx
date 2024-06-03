"use client";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { colorSchemes } from "@/lib/constants";
import { Switch } from "@/components/ui/switch";
import HeatMap from "@/components/custom/HeatMap";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const App = () => {
  const [formState, setFormState] = useState({
    username: "",
    theme: "light",
    color_scheme: "green",
    year: "2024",
    update_frequency: "hourly",
    day_labels: false,
    current_week_pointer: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name, checked) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleApply = async () => {
    setIsSubmitting(true);

    try {
      const hash = await getHash();

      const isValidUsername = await validateGithubUsername(formState.username);
      if (isValidUsername) {
        toast.info("Valid username. Updating data!");
      } else {
        toast.error("Invalid GitHub username");
        return;
      }

      const res = await axios.post(
        "https://api.getharmonize.app/gitscreen/update_user",
        {
          ...formState,
          hash,
        }
      );
      if (res.status === 200) toast.success("Successfully updated!");
    } catch (error) {
      console.log(error);
      toast.error("Error updating");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateGithubUsername = async (username) => {
    try {
      const res = await axios.get(`https://api.github.com/users/${username}`);
      return res.status === 200;
    } catch (error) {
      return false;
    }
  };

  return (
    <div className="flex w-full h-full text-gray-700">
      <div className="flex flex-col w-56 border-r border-gray-300">
        <div className="flex flex-col flex-grow p-4 ">
          <div className="my-1">
            <p className="text-sm tracking-tight mb-1">GitHub username</p>
            <Input
              type="text"
              placeholder="username"
              name="username"
              autoComplete="off"
              autoCorrect="off"
              value={formState.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="my-1">
            <p className="text-sm tracking-tight mb-1">Light/Dark</p>
            <Select
              onValueChange={(value) => handleSelectChange("theme", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Light" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="my-2">
            <p className="text-sm tracking-tight mb-1">Year</p>
            <Select
              onValueChange={(value) => handleSelectChange("year", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="2024" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="my-2">
            <p className="text-sm tracking-tight mb-1">Color scheme</p>
            <Select
              onValueChange={(value) =>
                handleSelectChange("color_scheme", value)
              }
            >
              <SelectTrigger className="capitalize">
                <SelectValue placeholder="Light" />
              </SelectTrigger>
              <SelectContent>
                {colorSchemes.map((color) => (
                  <SelectItem key={color} value={color} className="capitalize">
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="my-1">
            <p className="text-sm tracking-tight mb-1">Update frequency</p>
            <Select
              onValueChange={(value) =>
                handleSelectChange("update_frequency", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Every hour" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Every hour</SelectItem>
                <SelectItem value="daily">Every day (8pm)</SelectItem>
                <SelectItem value="twice_daily">
                  Twice a day (8am/pm)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 mb-2 mt-4">
            <Switch
              id="day-labels"
              checked={formState.day_labels}
              onCheckedChange={(checked) =>
                handleSwitchChange("day_labels", checked)
              }
            />
            <p className="tracking-tight text-sm">Day labels</p>
          </div>
          <div className="flex items-center space-x-2 my-2">
            <Switch
              id="current-week-pointer"
              checked={formState.current_week_pointer}
              onCheckedChange={(checked) =>
                handleSwitchChange("current_week_pointer", checked)
              }
            />
            <p className="tracking-tight text-sm">Current week pointer</p>
          </div>
          <div className="flex my-3">
            <Button
              className="leading-none w-full"
              onClick={handleApply}
              // disabled={formState.username.length === 0 || isSubmitting}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-grow">
        <div className="hidden flex items-center flex-shrink-0 h-16 px-8 border-b border-gray-300">
          <h1 className="text-lg font-medium">Page Title</h1>
          <button className="flex items-center justify-center h-10 px-4 ml-auto text-sm font-medium rounded hover:bg-gray-300">
            Action 1
          </button>
          <button className="flex items-center justify-center h-10 px-4 ml-2 text-sm font-medium bg-gray-200 rounded hover:bg-gray-300">
            Action 2
          </button>
          <button className="relative ml-2 text-sm focus:outline-none group">
            <div className="flex items-center justify-between w-10 h-10 rounded hover:bg-gray-300">
              {/* Icon Placeholder */}
            </div>
            <div className="absolute right-0 flex-col items-start hidden w-40 pb-1 bg-white border border-gray-300 shadow-lg group-focus:flex">
              <a
                className="w-full px-4 py-2 text-left hover:bg-gray-300"
                href="#"
              >
                Menu Item 1
              </a>
              <a
                className="w-full px-4 py-2 text-left hover:bg-gray-300"
                href="#"
              >
                Menu Item 2
              </a>
              <a
                className="w-full px-4 py-2 text-left hover:bg-gray-300"
                href="#"
              >
                Menu Item 3
              </a>
            </div>
          </button>
        </div>
        <div className="flex-grow p-6 bg-gray-200 ">
          <HeatMap sliceNumber={100} formState={formState} />
        </div>
      </div>
    </div>
  );
};

export default App;
