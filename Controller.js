const express = require("express");
const bodyParser = require("body-parser"); // transforma body das requisições em JSON
const cors = require("cors"); // não sei o que faz
const wifi = require('node-wifi');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:false})); // para trabalhar com requisições POST
app.use(bodyParser.json()); // para trabalhar com requisições JSON

wifi.init({
    iface: null // network interface, choose a random wifi interface if set to null
  });

let wifiList
  
app.listen(8080, ()=>{
    console.log('servidor rodando');
})

app.get('/',(req,res)=>{
    res.json({ok:true})
})

function getCurrentConnection(cb){
    wifi.getCurrentConnections((error, currentConnections) => {
        if (error) {
          return cb(error, undefined);
        } else {
          return cb(undefined, currentConnections);
          /*
          // you may have several connections
          [
              {
                  iface: '...', // network interface used for the connection, not available on macOS
                  ssid: '...',
                  bssid: '...',
                  mac: '...', // equals to bssid (for retrocompatibility)
                  channel: <number>,
                  frequency: <number>, // in MHz
                  signal_level: <number>, // in dB
                  quality: <number>, // same as signal level but in %
                  security: '...' //
                  security_flags: '...' // encryption protocols (format currently depending of the OS)
                  mode: '...' // network mode like Infra (format currently depending of the OS)
              }
          ]
          */
        }
      });
}

function getWifiInfo(cb){
    wifi.scan((error, networks) => {
        if (error) {
            return cb(error, undefined)
        } else {
            return cb(undefined, networks)
          /*
              networks = [
                  {
                    ssid: '...',
                    bssid: '...',
                    mac: '...', // equals to bssid (for retrocompatibility)
                    channel: <number>,
                    frequency: <number>, // in MHz
                    signal_level: <number>, // in dB
                    quality: <number>, // same as signal level but in %
                    security: 'WPA WPA2' // format depending on locale for open networks in Windows
                    security_flags: '...' // encryption protocols (format currently depending of the OS)
                    mode: '...' // network mode like Infra (format currently depending of the OS)
                  },
                  ...
              ];
              */
        }
      });
}

app.get('/get-wifi', (req, res, next)=>{
    getWifiInfo((error, ret)=>{
        if(error){
            return res.json(error);
        }

        res.json(ret);
    })
})

app.get('/get-current-connection', (req,res,next)=>{
    getCurrentConnection((err, ret)=>{
        if(err){
            return res.status(400).json(err);
        }

        console.log('teste', ret);
        return res.status(200).json(ret);
    })
})
