import React, { useState, useEffect } from "react";
import { View, Box, Button, Text } from 'react-native';
import axios from 'axios'
import './App.css'

const STATUS = {
  LOADING: { label: 'Carregando', info: 'Procurando ESP32', bgColor: "#ffaa00" },
  ON: { label: 'Desligar', info: 'Aparelho acionado', bgColor: "#b9d7a1" },
  OFF: { label: 'Ligar', info: 'Aparelho desligado', bgColor: "#98092b" }
}

const viewStyle = {
  display: "flex",
  height: '100%',
  padding: 20,
  alignItems:'center',
  fontSize: '3vh'
}

const BASE_URL = 'http://localhost:8080/'

export default function App() {
  const [power, setPower] = useState(false)
  const [statusInfo, setStatusInfo] = useState(STATUS.OFF)
  const [espConnection, setEspConnection] = useState();
  const [permissionTest, setPermissionTest] = useState('')
  const [wifiText, setWifiText] = useState('')
  const [buttonInfo, setButtonInfo] = useState({label:'Ligar', color:'gray'})

  useEffect(() => {
    axios.get(BASE_URL + 'get-esp-connection').then(ret => {
      if(statusInfo.label != 'Carregando') {
        setStatusInfo({ ...STATUS.OFF })
        setPower(false);
      }
      setEspConnection({ ...ret })
    })

  }, [])

  useEffect(() => {
    if (statusInfo.label == 'Carregando') {
      turnOnEsp();
    }
  }, [espConnection])

  function turnOnEsp() {
    axios.get(BASE_URL + 'ligar').then(ret => {
      console.log('ret - onn', ret)
    }).catch(err => {
      console.log('err', err)
    });
    setStatusInfo({ ...STATUS.ON })
  }

  function turnOffEsp() {
    axios.get(BASE_URL + 'desligar').then(ret => {
      console.log('ret - off', ret)
    }).catch(err => {
      console.log('err', err)
    });;
    setStatusInfo({ ...STATUS.OFF })
  }

  function connectEspWifi() {
    axios.get(BASE_URL + 'get-esp-connection').then(ret => {
      setEspConnection({ ...ret })
    })
  }

  function callPower() { // TODO Fazer condição para evitar clicar várias vezes
    if (!espConnection) {
      setStatusInfo({ ...STATUS.LOADING })
      return
    }
    const newPower = !power;
    setPower(!power)

    if (newPower) {
      turnOffEsp();
    } else {
      turnOnEsp();
    }
  }
  return (

    <View style={viewStyle}>
      <div className="section-01">
        <Text style={{ marginBottom: 30, fontSize:25 }}>
          {statusInfo?.info ?? ''}
        </Text>
      </div>

      <div className="section-02">
        <Button style={{ marginTop: 100, background: statusInfo.bgColor }} title={statusInfo.label} onPress={() => callPower()} />
      </div>
    </View>

  );
}