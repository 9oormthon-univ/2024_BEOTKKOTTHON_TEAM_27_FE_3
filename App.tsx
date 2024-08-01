import Clipboard from '@react-native-clipboard/clipboard';
import CameraRoll from '@react-native-community/cameraroll';
import React from 'react';
import {Alert, Platform, SafeAreaView, StyleSheet} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import Share from 'react-native-share';

function App(): React.JSX.Element {
  const webviewRef = React.useRef<WebView>(null);

  const onMessageFromWebView = ({nativeEvent}: WebViewMessageEvent) => {
    const {type, data} = JSON.parse(nativeEvent.data);
    console.log(type, data);

    if (type === 'saveAll') {
      copyText(data.text);
      downloadImage(data.url);
    } else if (type === 'shareInsta') {
      shareInsta(data.filePath);
    }
  };

  function downloadImage(url: string) {
    console.log('>>> url', url);
    CameraRoll.save(url, {type: 'photo'})
      .then(value => {
        console.log(value);
        webviewRef.current?.postMessage(
          JSON.stringify({
            type: 'saveAllResult',
            data: {success: true, imagePath: value},
          }),
        );
        Alert.alert('이미지 저장에 성공하였습니다. ');
      })
      .catch(e => {
        console.error(e);
        webviewRef.current?.postMessage(
          JSON.stringify({
            type: 'saveAllResult',
            data: {success: false, imagePath: ''},
          }),
        );
        Alert.alert('이미지 저장에 실패하였습니다. ');
      });
  }

  function copyText(text: string) {
    Clipboard.setString(text);
    Alert.alert('클립보드에 복사되었습니다.');
  }

  function shareInsta(filePath: string) {
    Share.shareSingle({
      social: Share.Social.INSTAGRAM,
      url: `file://${filePath}`,
      type: 'image/*',
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webviewRef}
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
