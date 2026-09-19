import { StyleSheet, View } from 'react-native';

import { dashboardColors } from '../theme/dashboard';

export function BlankTabScreen() {
  return <View style={styles.root} />;
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: dashboardColors.surface,
    flex: 1,
  },
});
