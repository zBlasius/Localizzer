import React, { useState, useEffect } from "react";
import { View, Box, Button, Text } from 'react-native';
import axios from 'axios'
import { PermissionsAndroid } from 'react-native';
import {wifi} from 'react-native-android-wifi';

const STATUS = {
  LOADING: { label: 'Carregando', info: 'Procurando ESP32', bgColor: "#ffaa00" },
  ON: { label: 'Desligar', info: 'Aparelho acionado', bgColor: "#b9d7a1" },
  OFF: { label: 'Ligar', info: 'Aparelho desligado', bgColor: "#98092b" }
}

const BASE_URL = 'http://localhost:8080/'

export default function App() {
  const [power, setPower] = useState(false)
  const [statusInfo, setStatusInfo] = useState(STATUS.OFF)
  const [espConnection, setEspConnection] = useState();
  const [permissionTest, setPermissionTest] = useState('')
  const [wifiText, setWifiText] = useState('')

  useEffect(() => {
    // axios.get(BASE_URL + 'get-esp-connection').then(ret => {
    //   setEspConnection({ ...ret })
    // })

  }, [])

  useEffect(() => {
    if (statusInfo.label == 'Carregando') {
      setPower(!power)
      // turnOnEsp();
    }
    testeWifi();
  }, [espConnection])

  async function testeWifi() {

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Wifi networks',
          'message': 'We need your permission in order to find wifi networks',
          "buttonPositive":"ok"
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Thank you for your permission! :)");
        getWifiList()
      } else {
        console.log("You will not able to retrieve wifi available networks list");
      }
    } catch (err) {
      // console.warn(err)
    }
  }


  function getWifiList(){
    try {
      wifi.isEnabled((isEnabled) => {
        console.log('deu certo')
        if (isEnabled) {
          setWifiText('FOI CARALHOOOOOO')
        } else {
          setWifiText('deu ruim')
        }
      });
    } catch (error) {
      console.log('deu erro:', error)
    }
  }


  function turnOnEsp() {
    fetch('http://192.168.4.1:80/ligar').then(ret => {
      console.log('ret - onn', ret)
    }).catch(err => {
      console.log('err', err)
    });
    setStatusInfo({ ...STATUS.ON })
  }

  function turnOffEsp() {
    fetch('http://192.168.4.1:80/desligar').then(ret => {
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

    // if (newPower) {
    //   turnOffEsp();
    // } else {
    //   turnOnEsp();
    // }
  }
  return (

    <View style={{
        display: "flex",
        height: '100%',
        padding: 20,
        justifyContent:'center',
        alignItems:'center'
    }}>

      {/* <Box flex={1} bg={statusInfo?.bgColor ?? ''} alignItems="center" justifyContent="center"> */}
      <Text style={{
        marginBottom:30
      }}>
        {statusInfo?.info ?? ''}
      </Text>

      <Text style={{
        marginBottom:30
      }}>
        {permissionTest} ,,,,, {wifiText}
      </Text>
      {/* </Box>; */}
      {/* <Box flex={4} bg={statusInfo?.bgColor ?? ''} alignItems="center" justifyContent="center"> */}
      <Button style={{ marginTop: 100 }} title="tester" onPress={() => callPower()} />

      {/* </Box> */}
    </View>


  );
}