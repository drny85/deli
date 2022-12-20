import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useAppSelector } from "../redux/store";

interface Props {
  bgColor?: ViewStyle["backgroundColor"];
  small?: boolean;
}

const Divider = ({ bgColor, small }: Props) => {
  const theme = useAppSelector((state) => state.theme);
  return (
    <View
      style={[
        styles.view,
        {
          backgroundColor: bgColor ? bgColor : theme.ASCENT,
          width: small ? "75%" : "95%",
          alignSelf: "center",
        },
      ]}
    ></View>
  );
};

export default Divider;

const styles = StyleSheet.create({
  view: {
    width: "95%",
    height: 0.4,

    justifyContent: "center",
    alignSelf: "center",

    opacity: 0.4,
    elevation: 10,
    margin: 10,
  },
});
