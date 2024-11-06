import * as Slider from '@radix-ui/react-slider';

interface RadixSliderProps {
  value: number;
  onValueChange: (value: number[]) => void;
}

const RadixSlider = ({ value, onValueChange }: RadixSliderProps) => {
  return (
    <div className="w-full">
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-2"
        value={[value]}
        onValueChange={onValueChange}
        min={50}
        max={50000}
        step={100}
        aria-label="Value"
      >
        <Slider.Track className="bg-gray-200 relative grow rounded-full h-1">
          <Slider.Range className="absolute bg-primary rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb className="block w-6 h-6 bg-white border border-primary rounded-full shadow-md focus:outline-none" />
      </Slider.Root>
      <div className="flex justify-between mt-2 text-gray-500">
        <span>$50</span>
        <span>$50,000</span>
      </div>
    </div>
  );
};

export default RadixSlider;
