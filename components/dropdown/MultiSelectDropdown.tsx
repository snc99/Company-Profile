import React from "react";
import Select, { ActionMeta } from "react-select";

type Option = {
  value: string;
  label: string;
};

interface MultiSelectDropdownProps {
  options: Option[];
  selectedOptions: Option[]; 
  error?: boolean;
  onChange: (selectedOptions: Option[], actionMeta: ActionMeta<Option>) => void; 
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedOptions,
  error,
  onChange,
}) => {
  return (
    <Select
      name="techstack"
      isMulti
      options={options}
      value={selectedOptions}
      onChange={(selected, actionMeta) =>
        onChange(selected ? [...selected] : [], actionMeta)
      }
      classNamePrefix="react-select"
      placeholder="Pilih Tech Stack..."
      styles={{
        control: (base, state) => ({
          ...base,
          marginTop: "8px",
          borderColor: error
            ? "#ef4444"
            : state.isFocused
            ? "#3b82f6"
            : "#d1d5db",
          borderWidth: "1px",
          borderRadius: "6px",
          transition: "border-color 0.2s, box-shadow 0.2s",
          outline: "none",
          "&:hover": {
            borderColor: error ? "#dc2626" : "#3b82f6",
          },
        }),
      }}
    />
  );
};

export default MultiSelectDropdown;
