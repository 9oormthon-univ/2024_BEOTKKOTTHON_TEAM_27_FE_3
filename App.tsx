import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import React from 'react';
import {Platform, SafeAreaView, StyleSheet} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';

function App(): React.JSX.Element {
  const onMessageFromWebView = ({nativeEvent}: WebViewMessageEvent) => {
    const {type, data} = JSON.parse(nativeEvent.data);
    console.log(type, data);

    if (type === 'downloadImage') {
      downloadImage();
    } else if (type === 'shareInsta') {
      shareInsta();
    }
  };

  function downloadImage() {
    CameraRoll.save(
      'http://169.254.253.131:5173/src/assets/Image/sodong_smile.png',
      {type: 'photo'},
    )
      .then(value => console.log(value))
      .catch(e => console.error(e));
  }
  function shareInsta() {}

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{uri: 'http://169.254.253.131:5173/'}}
        onMessage={onMessageFromWebView}
        userAgent={`sodong_${Platform.OS}`}
      />
    </SafeAreaView>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
