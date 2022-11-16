import React, { useState, useEffect } from "react";
import { NativeBaseProvider, Box, extendTheme, Button, Text, Container, Center, Heading } from "native-base";
import axios from 'axios'
import './App.css'

const STATUS = {
  LOADING: { label: 'Carregando' , info: 'Procurando ESP32', bgColor: "#ffaa00" },
  ON: { label: 'Desligar' , info: 'Aparelho acionado', bgColor: "#b9d7a1"},
  OFF: { label: 'Ligar', info: 'Aparelho desligado', bgColor:  "#98092b" }
}

const BASE_URL = 'http://localhost:8080/'

export default function App() {
  const [power, setPower] = useState(false)
  const [statusInfo, setStatusInfo] = useState(STATUS.OFF)
  const [espConnection, setEspConnection] = useState();

  useEffect(() => {
    axios.get( BASE_URL + 'get-esp-connection').then(ret => {
      setEspConnection({ ...ret })
    })
  }, [])

  useEffect(() => {
    if (statusInfo.label == 'Carregando') {
      setPower(!power)
      turnOnEsp();
    }
  }, [espConnection])

  function turnOnEsp() {
    fetch('http://192.168.4.1:80/ligar').then(ret=>{
      console.log('ret - onn', ret)
    }).catch(err=>{
      console.log('err',err)
    });
    setStatusInfo({...STATUS.ON})
  }

  function turnOffEsp() {
    fetch('http://192.168.4.1:80/desligar').then(ret=>{
      console.log('ret - off', ret)
    }).catch(err=>{
      console.log('err',err)
    });;
    setStatusInfo({...STATUS.OFF})
  }

  function connectEspWifi(){
    axios.get( BASE_URL + 'get-esp-connection').then(ret => {
      setEspConnection({ ...ret })
    })
  }

  function callPower() { // TODO Fazer condição para evitar clicar várias vezes
    if (!espConnection) {
      setStatusInfo({...STATUS.LOADING})
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
    <NativeBaseProvider >

      <Box flex={1} bg={statusInfo.bgColor} alignItems="center" justifyContent="center">
        <Text mt="3" fontWeight="medium">
            {statusInfo.info}
        </Text>
      </Box>;

      <Box flex={4} bg={statusInfo.bgColor} alignItems="center" justifyContent="center">
        <Button size={'md'} onPress={() => callPower()}>
          {statusInfo.label}
        </Button>
      </Box>

    </NativeBaseProvider>
  );
}