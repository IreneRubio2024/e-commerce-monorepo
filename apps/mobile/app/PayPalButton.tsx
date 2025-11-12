import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";

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
  const CLIENT_ID =
    process.env.EXPO_PUBLIC_PAYPAL_CLIENT_ID ||
    "AUa_2VKidyFS717-wJIqOs1gL9qhFS8KzM0oTGzSVZIp5cHzyC_tC8_Z1VOzPTBqZ8G9fw1Atq5CDetu";

  // HTML content for WebView
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&currency=USD&intent=capture&enable-funding=card"></script>
        <style>
          body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
          #paypal-button-container { width: 100%; max-width: 400px; }
        </style>
      </head>
      <body>
        <div id="paypal-button-container"></div>
        <script>
          function waitForPayPal() {
            if (window.paypal) {
              paypal.Buttons({
                style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
                createOrder: function(data, actions) {
                  return actions.order.create({
                    purchase_units: [{
                      amount: { value: '${amount}', currency_code: 'USD' },
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
                      email: details.payer.email_address,
                      name: details.payer.name.given_name + ' ' + details.payer.name.surname,
                      amount: details.purchase_units[0].amount.value,
                      currency: details.purchase_units[0].amount.currency_code
                    }));
                  });
                },
                onError: function(err) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'error',
                    error: err.toString()
                  }));
                },
                onCancel: function() {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'cancel'
                  }));
                }
              }).render('#paypal-button-container');
            } else {
              setTimeout(waitForPayPal, 300);
            }
          }
          waitForPayPal();
        </script>
      </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "success") {
        onSuccess(data);
      } else if (data.type === "error") {
        onError?.(data.error);
      } else if (data.type === "cancel") {
        console.log("PayPal payment canceled");
      }
    } catch (err) {
      console.error("Error parsing message:", err);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ html }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={["*"]}
        startInLoadingState
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
  container: { height: 400, width: "100%" }, // taller for guest card input
  webview: { flex: 1, backgroundColor: "transparent" },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PayPalButton;
