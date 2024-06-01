import HeatMap from "@/components/HeatMap";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const App = () => {
  return (
    <div className="flex w-screen h-screen text-gray-700">
      <div className="flex flex-col w-56 border-r border-gray-300">
        <div className="flex flex-col flex-grow p-4 overflow-auto">
          <div className="my-1">
            <p className="text-sm tracking-tight mb-1">GitHub username</p>{" "}
            <Input type="text" placeholder="username" />
          </div>
          <div className="my-1">
            <p className="text-sm tracking-tight mb-1">Light/Dark</p>{" "}
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Light" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <hr className="my-3" />
          <div className="my-1 mb-2">
            <p className="text-sm tracking-tight mb-1">Color scheme</p>{" "}
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Light" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="my-1">
            <p className="text-sm tracking-tight mb-1">Update frequency</p>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Every hour " />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">Every hour</SelectItem>
                <SelectItem value="light">Every day (10pm)</SelectItem>
                <SelectItem value="dark">Twice a day (10am/pm)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 mb-2 mt-4">
            <Switch id="airplane-mode" />
            <p className="tracking-tight text-sm">Day labels</p>
          </div>
          <div className="flex items-center space-x-2 my-2">
            <Switch id="airplane-mode" />
            <p className="tracking-tight text-sm">Current week pointer </p>
          </div>
          <div className="flex items-center flex-shrink-0 mt-auto">
            <Button className="leading-none w-full">Apply </Button>
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
        <div className="flex-grow p-6  bg-gray-200 ">
          <HeatMap sliceNumber={100} />
        </div>
      </div>
    </div>
  );
};

export default App;

// 800 x 500
