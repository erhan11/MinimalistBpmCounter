import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';

const App = () => {
  const [bpm, setBpm] = useState(0); // Track BPM
  const [beatCount, setBeatCount] = useState(0); // Track total beats
  const [barCount, setBarCount] = useState(0); // Track total bars
  const [taps, setTaps] = useState([]); // Store tap timestamps

  useEffect(() => {
    // Check if no taps occurred for 2 seconds
    const interval = setInterval(() => {
      if (taps.length > 0) {
        const now = Date.now();
        const lastTap = taps[taps.length - 1];

        // Reset if the last tap was more than 2 seconds ago
        if (now - lastTap > 2000) {
          resetCounters();
        }
      }
    }, 500); // Check every 500ms

    return () => clearInterval(interval); // Clean up on component unmount
  }, [taps]);

  const resetCounters = () => {
    setBpm(0);
    setBeatCount(0);
    setBarCount(0);
    setTaps([]);
  };

  const handleTap = () => {
    const now = Date.now();

    // Increment beat count
    setBeatCount(prevCount => {
      const newBeatCount = prevCount + 1;

      // Increment bar count every 4 beats
      if (newBeatCount % 4 === 0) {
        setBarCount(prevBar => prevBar + 1);
      }

      return newBeatCount;
    });

    // BPM Logic: Calculate BPM from tap intervals
    setTaps(prevTaps => {
      const filteredTaps = prevTaps.filter(time => now - time <= 2000); // Keep taps in the last 2 seconds
      const updatedTaps = [...filteredTaps, now];

      if (updatedTaps.length > 1) {
        const intervals = updatedTaps
          .slice(1)
          .map((time, index) => time - updatedTaps[index]);
        const averageInterval =
          intervals.reduce((total, interval) => total + interval, 0) /
          intervals.length;

        setBpm(Math.round(60000 / averageInterval)); // Calculate BPM
      }

      return updatedTaps;
    });
  };

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={styles.container}>
        {/* Display BPM */}
        <Text style={styles.bpmText}>
          {bpm > 0 ? `${bpm} BPM` : 'Tap Anywhere to Start'}
        </Text>

        {/* Display Beat Count */}
        <Text style={styles.infoText}>{`Beats: ${beatCount}`}</Text>

        {/* Display Bar Count */}
        <Text style={styles.infoText}>{`Bars: ${barCount}`}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  bpmText: {
    fontSize: 48,
    color: '#fff',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 24,
    color: '#fff',
    marginTop: 10,
  },
});

export default App;
