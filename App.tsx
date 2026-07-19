import { StatusBar, StyleSheet, Text, View } from 'react-native';

function App() {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFF8F8"
      />

      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View accessibilityRole="header" style={styles.brand}>
        <Text style={styles.mark}>bw</Text>
        <View style={styles.wordmark}>
          <Text style={styles.beta}>Beta</Text>
          <Text style={styles.a}>a</Text>
          <Text style={styles.work}>Work</Text>
        </View>
      </View>

      <Text style={styles.tagline}>Work better. Grow further.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFF8F8',
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glowTop: {
    backgroundColor: '#FFE4E4',
    borderRadius: 190,
    height: 380,
    position: 'absolute',
    right: -220,
    top: -190,
    width: 380,
  },
  glowBottom: {
    backgroundColor: '#FDEEEE',
    borderRadius: 150,
    bottom: -180,
    height: 300,
    left: -170,
    position: 'absolute',
    width: 300,
  },
  brand: {
    alignItems: 'center',
  },
  mark: {
    color: '#151515',
    fontSize: 74,
    fontWeight: '300',
    letterSpacing: -9,
    lineHeight: 78,
  },
  wordmark: {
    alignItems: 'baseline',
    flexDirection: 'row',
    marginTop: 2,
  },
  beta: {
    color: '#D71920',
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: -1,
  },
  a: {
    color: '#D71920',
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: -1,
  },
  work: {
    color: '#151515',
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: -1,
  },
  tagline: {
    bottom: 52,
    color: '#6D6464',
    fontSize: 13,
    letterSpacing: 0.7,
    position: 'absolute',
  },
});

export default App;
