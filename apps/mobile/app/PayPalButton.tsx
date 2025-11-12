
import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
interface PayPalButtonProps {
  amount: string;
  orderId: number;
  onSuccess: (details: any) => void;
  onError?: (error: any) => void;
}
const PayPalButton: React.FC<PayPalButtonProps> = ({
  amount,
  orderId,
  onSuccess,
  onError,
}) => {
  const CLIENT_ID = process.env.EXPO_PUBLIC_PAYPAL_CLIENT_ID || 'AUa_2VKidyFS717-wJIqOs1gL9qhFS8KzM0oTGzSVZIp5cHzyC_tC8_Z1VOzPTBqZ8G9fw1Atq5CDetu';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <script src="https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}"></script>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        #paypal-button-container {
          padding: 0;
        }
      </style>
    </head>
    <body>
      <div id="paypal-button-container"></div>
      <script>
        paypal.Buttons({
          createOrder: function(data, actions) {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: '${amount}',
                  currency_code: 'USD'
                },
                description: 'Order #${orderId}'
              }]
            });
          },
          onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'success',
                orderID: data.orderID,
                payerID: data.payerID,
                details: details
              }));
            });
          },
          onError: function(err) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'error',
              error: err.toString()
            }));
          },
          onCancel: function(data) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'cancel'
            }));
          }
        }).render('#paypal-button-container');
      </script>
    </body>
    </html>
  `
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'success') {
        onSuccess(data);
      } else if (data.type === 'error') {
        onError?.(data.error);
      }
    } catch (err) {
      console.error('Error parsing message:', err);
    }
  };
  return (
    <View style={styles.container}>
      <WebView
        source={{ html }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0070BA" />
          </View>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 200,
    width: '100%',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default PayPalButton;