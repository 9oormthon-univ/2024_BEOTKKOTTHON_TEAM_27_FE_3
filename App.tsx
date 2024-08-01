import CameraRoll from '@react-native-community/cameraroll';
import React from 'react';
import {Alert, Platform, SafeAreaView, StyleSheet} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';

function App(): React.JSX.Element {
  const onMessageFromWebView = ({nativeEvent}: WebViewMessageEvent) => {
    const {type, data} = JSON.parse(nativeEvent.data);
    console.log(type, data);

    if (type === 'downloadImage') {
      downloadImage(data.url);
    } else if (type === 'shareInsta') {
      shareInsta();
    }
  };

  function downloadImage(url: string) {
    console.log('>>> url', url);
    CameraRoll.save(url, {type: 'photo'})
      .then(value => {
        console.log(value);
        Alert.alert('이미지 저장에 성공하였습니다. ');
      })
      .catch(e => {
        console.error(e);
        Alert.alert('이미지 저장에 실패하였습니다. ');
      });
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
