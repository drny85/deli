import { View, ViewStyle } from "react-native";
import React, { FC } from "react";
import { SIZES } from "../constants";

interface Props {
  verticalAlign?: ViewStyle["alignItems"] | undefined;
  horizontalAlign?: ViewStyle["justifyContent"] | undefined;
  containerStyle?: ViewStyle;
  children: React.ReactNode;
  px?: number;
  py?: number;
}

const Stack: FC<Props> = ({
  verticalAlign,
  horizontalAlign,
  px,
  py,
  children,
  containerStyle,
}): JSX.Element => {
  return (
    <View
      style={{
        paddingVertical: py ? py : SIZES.padding,
        paddingHorizontal: px ? px : SIZES.padding,
        justifyContent: horizontalAlign || "flex-start",
        alignItems: verticalAlign || "flex-start",
        ...containerStyle,
      }}
    >
      {children}
    </View>
  );
};

export default Stack;
