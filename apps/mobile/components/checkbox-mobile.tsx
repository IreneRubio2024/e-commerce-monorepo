import React, { forwardRef, useState } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

type CheckboxProps = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: number;
  color?: string;
  style?: object;
};

const Checkbox = forwardRef<View, CheckboxProps>(
  (
    {
      checked: checkedProp = false,
      onChange,
      disabled = false,
      size = 20,
      color = "#000",
      style,
    },
    ref
  ) => {
    const [checked, setChecked] = useState(checkedProp);

    const toggle = () => {
      if (disabled) return;
      const newValue = !checked;
      setChecked(newValue);
      onChange?.(newValue);
    };

    return (
      <TouchableOpacity
        ref={ref}
        activeOpacity={0.8}
        onPress={toggle}
        disabled={disabled}
        style={[
          styles.checkbox,
          {
            width: size,
            height: size,
            borderColor: color,
            backgroundColor: checked ? color : "transparent",
            opacity: disabled ? 0.5 : 1,
          },
          style,
        ]}
      >
        {checked && <Feather name="check" size={size * 0.7} color="#fff" />}
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  checkbox: {
    borderWidth: 2,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});

export { Checkbox };
