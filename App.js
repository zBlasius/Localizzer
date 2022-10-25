import React, { useState, useEffect } from "react";
import { NativeBaseProvider, Box, extendTheme, Button } from "native-base";

const STATUS = {
  LOADING:{label:'Carregando'},
  ON: {label:'Ligado'},
  OFF:{label:'Desligado'}
}

export default function App() {
  const [power, setPower] = useState(false)
  const [labelButton, setLabelButton] = useState('');
  const [wifiList, setWifiList] = useState([]);

  useEffect(()=>{
    if(!power){
      return setLabelButton('Desligado')
    }

    setLabelButton('Ligado')
  },[power])

  useEffect(()=>{
    fetch('http://localhost:8080/get-current-connection').then(ret=>{
        console.log('testeret ', ret)
        setWifiList([...ret]);
    })
  },[])

  const newColorTheme = {
    brand: {
      900: "#8287af",
      800: "#7c83db",
      700: "#1B2430",
    },
  };
  const theme = extendTheme({ colors: newColorTheme });

  function callPower() {
    const newPower = !power;
    setPower(newPower)

    if (newPower) {
      fetch('http://192.168.4.1:80/desligar').then(ret => {
        console.log(ret);
      });
    } else {
      fetch('http://192.168.4.1:80/ligar');
    }
  }

  return (
    <NativeBaseProvider theme={theme}>
      <Box flex={1} bg="brand.700" alignItems="center" justifyContent="center">
        <Button
          size={'md'}
          onPress={() => callPower()}
        > 'teste'  </Button>

      {wifiList && wifiList.map(item=>(
        item.ssid
      ))}
      {console.log('teste', wifiList)}
      </Box>
    </NativeBaseProvider>
  );
}