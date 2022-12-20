import React from "react";
import { ActivityIndicator, View } from "react-native";

import { useAppSelector } from "../redux/store";

const Loader = (): JSX.Element => {
  const theme = useAppSelector((state) => state.theme);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.BACKGROUND_COLOR,
      }}
    >
      <ActivityIndicator color={theme.ASCENT} size="large" />
    </View>
  );
};

export default Loader;
