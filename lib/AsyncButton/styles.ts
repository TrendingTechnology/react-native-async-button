import { ImageStyle, RegisteredStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

const styles: { [prop: string]: RegisteredStyle<ImageStyle | TextStyle | ViewStyle> } = StyleSheet.create({
  container: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
