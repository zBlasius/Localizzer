#include <WiFi.h>

const char *ssid = "ESP-123456789";
const char *pass = "12345678";

WiFiServer server(80);  // Port

void setup() {
  Serial.begin(115200);  // Inicia o monitor serial (115200)
  pinMode(2, OUTPUT);    // Define porta de saída
  delay(10);

  Serial.println("\n");     // Pula uma linha
  WiFi.softAP(ssid, pass);  // Inicia o ponto de acesso
  Serial.print("Se conectando a: ");
  Serial.println(ssid);

  IPAddress ip = WiFi.softAPIP();
  Serial.print("Endereço de IP: ");
  Serial.println(ip);

  server.begin();
  Serial.println("Servidor online");
}

bool showStatus = false;
bool status = false;

void loop() {
  WiFiClient client = server.available();  // Cria o objeto cliente

  if (client) {
    String line = "";  // Dados recebidos

    while (client.connected()) {
      if (client.available()) {
        char c = client.read();  // Lê os caracteres recebidos

        if (c == '\n') {             // Se houver uma quebra de linha
          if (line.length() == 0) {  // Se a nova linha tiver 0 de tamanho
            if (showStatus) {
              client.println("HTTP/1.1 200 OK");  // Envio padrão de início de comunicação
              client.println("Content-type:application/json");
              client.println("Access-Control-Allow-Origin: *");
              client.println();
              if (status) {
                client.println("{\"status\": true }");
              } else {
                client.println("{\"status\": false }");
              }

              showStatus = false;
            } else {
              client.println("HTTP/1.1 200 OK");  // Envio padrão de início de comunicação
              client.println("Content-type:text/html");
              client.println("Access-Control-Allow-Origin: *");
              client.println();
              client.println("Foi!");
            }

            client.println();
            break;
          } else {
            line = "";
          }
        } else if (c != '\r') {
          line += c;  // Adiciona o caractere recebido à linha de leitura
        }

        if (line.endsWith("GET /ligar")) {
          status = true;
          digitalWrite(2, HIGH);
        } else if (line.endsWith("GET /desligar")) {
          status = false;
          digitalWrite(2, LOW);
        } else if (line.endsWith("GET /status")) {
          showStatus = true;
        }
      }
    }

    client.stop();  // Para o cliente
  }
}