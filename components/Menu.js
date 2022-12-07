import React, { useState, useEffect } from "react";
import { View, Box, Button, Text } from 'react-native';
import axios from 'axios'
import './Menu.css'

const STATUS = {
  LOADING: { label: 'Carregando', info: 'Procurando ESP32', bgColor: "#ffaa00" },
  ON: { label: 'Desligar', info: 'Aparelho acionado', bgColor: "#b9d7a1" },
  OFF: { label: 'Ligar', info: 'Aparelho desligado', bgColor: "#98092b" }
}

const viewStyle = {
  display: "flex",
  height: '100%',
  padding: 20,
  alignItems: 'center',
  fontSize: '3vh'
}

const BASE_URL = 'http://localhost:8080/'

export default function Menu() {
  const [power, setPower] = useState(true)
  const [statusInfo, setStatusInfo] = useState(STATUS.OFF)
  const [espConnection, setEspConnection] = useState();

  useEffect(() => {
    const ssid = localStorage.getItem('ssid');

    axios.get(BASE_URL + 'get-esp-connection', { params: { ssid } }).then(ret => {
      setEspConnection({ ...ret.data })
    })
  }, [])

  useEffect(() => {
    if (statusInfo.label == 'Carregando') {
      turnOnEsp();
    }
  }, [espConnection])

  // useEffect(() => {
  //   if (statusInfo.label == 'Ligar') {
  //     setPower(true);
  //   }
  //   setPower(false);
  // }, [statusInfo])

  function turnOnEsp() {
    setPower(false);
    const ssid = localStorage.getItem('ssid');

    axios.get(BASE_URL + 'ligar', { params: { ssid } }).then(ret => {
      setStatusInfo({ ...STATUS.ON })
      fetch('http://192.168.4.1/ligar').then(ret => {
        console.log('teste', ret)
      })
    })
  }

  function turnOffEsp() {
    setPower(true);
    setStatusInfo({ ...STATUS.OFF })
    fetch('http://192.168.4.1/desligar').then(ret => {
      console.log('teste', ret)
    }).catch()
  }

  function callPower() { // TODO Fazer condição para evitar clicar várias vezes
    if (!espConnection) {
      setStatusInfo({ ...STATUS.LOADING })
      return
    }

    if (power) {
      turnOnEsp();
    } else {
      turnOffEsp();
    }
  }

  return (

    <View style={viewStyle}>
      <div className="section-01">
        <Text style={{ marginBottom: 30, fontSize: 25 }}>
          {statusInfo?.info ?? ''}
        </Text>
      </div>

      <div className="section-02">
        <Button style={{ marginTop: 100, background: statusInfo.bgColor }} title={statusInfo.label} onPress={() => callPower()} />
      </div>
    </View>

  );
}
