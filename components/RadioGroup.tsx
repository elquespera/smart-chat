import clsx from "clsx";
import { useEffect, useState } from "react";

export interface RadioGroupItemProps {
  value?: string;
  children?: React.ReactNode;
}

interface RadioGroupProps {
  name?: string;
  value?: string;
  className?: string;
  children?:
    | React.ReactElement<RadioGroupItemProps>
    | React.ReactElement<RadioGroupItemProps>[];
  onChange?: (value?: string) => void;
}

export default function RadioGroup({
  name,
  value,
  className,
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
          `relative select-none cursor-pointer overflow-hidden
          rounded-md p-2
          hover:bg-highlight`,
          checked &&
            "text-contrast before:absolute before:inset-0 before:bg-primary"
        )}
      >
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          className="sr-only"
          onChange={() => handleChange(value)}
        />
        <div className="relative">{item.props.children}</div>
      </label>
    );
  };

  useEffect(() => {
    setSelected(value);
  }, [value]);

  return (
    <ul className={clsx("flex gap-1", className)}>
      {Array.isArray(children)
        ? children.map((child, index) => renderRadio(index, child))
        : renderRadio(0, children)}
    </ul>
  );
}

const RadioGroupItem: React.FunctionComponent<RadioGroupItemProps> = () => {
  return null;
};

RadioGroup.Item = RadioGroupItem;
