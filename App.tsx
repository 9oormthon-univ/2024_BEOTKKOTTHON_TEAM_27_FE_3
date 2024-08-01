import Clipboard from '@react-native-clipboard/clipboard';
import CameraRoll from '@react-native-community/cameraroll';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import Share from 'react-native-share';
import SplashScreen from 'react-native-splash-screen';

function App(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const webviewRef = React.useRef<WebView>(null);

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);

  const onMessageFromWebView = ({nativeEvent}: WebViewMessageEvent) => {
    const {type, data} = JSON.parse(nativeEvent.data);
    console.log(type, data);

    if (type === 'saveAll') {
      setIsLoading(true);
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
      })
      .finally(() => {
        setIsLoading(false);
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
      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={'#fff'} />
        </View>
      )}
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
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
  },
});
