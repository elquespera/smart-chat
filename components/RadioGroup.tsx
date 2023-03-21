import clsx from "clsx";
import { useState } from "react";

export interface RadioGroupItemProps {
  value?: string;
  children?: React.ReactNode;
}

interface RadioGroupProps {
  name?: string;
  children?:
    | React.ReactElement<RadioGroupItemProps>
    | React.ReactElement<RadioGroupItemProps>[];
  onChange?: (value?: string) => void;
}

export default function RadioGroup({
  name,
  children,
  onChange,
}: RadioGroupProps) {
  const [selected, setSelected] = useState<string>();

  const handleChange = (value?: string) => {
    setSelected(value);
    if (onChange) onChange(value);
  };

  const renderRadio = (
    index: number,
    item?: React.ReactElement<RadioGroupItemProps>
  ) => {
    if (!item) return null;
    const checked = selected === item.props.value;
    const { value } = item.props;
    return (
      <label
        key={index}
        title={value}
        className={clsx(
          "relative flex flex-col items-center select-none cursor-pointer overflow-hidden rounded-md p-2",
          checked &&
            "before:absolute before:inset-0 before:opacity-20 before:bg-primary"
        )}
      >
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          className="w-0 h-0 relative"
          onChange={() => handleChange(value)}
        />
        <span>{item.props.children}</span>
      </label>
    );
  };

  return (
    <ul className="flex gap-2">
      {Array.isArray(children)
        ? children.map((child, index) => renderRadio(index, child))
        : renderRadio(0, children)}
    </ul>
  );
}

RadioGroup.Item = function RadioGroupItem({ children }: RadioGroupItemProps) {
  return <>{children}</>;
};
