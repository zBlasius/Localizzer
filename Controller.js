const express = require("express");
const bodyParser = require("body-parser"); // transforma body das requisições em JSON
const cors = require("cors"); // não sei o que faz
const wifi = require('node-wifi');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); // para trabalhar com requisições POST
app.use(bodyParser.json()); // para trabalhar com requisições JSON

wifi.init({
    iface: null // network interface, choose a random wifi interface if set to null
});

app.listen(8080, () => {
    console.log('servidor rodando');
})

app.get('/', (req, res) => {
    res.json({ ok: true })
})

app.get('/get-current-connection', (req, res, next) => {
    getCurrentConnection((err, ret) => {
        if (err) {
            return res.status(400).json(err);
        }

        return res.status(200).json(ret);
    })
})

app.get('/get-wifi-list', (req, res, next) => {
    getWifiList((error, ret) => {
        if (error) {
            return res.json(error);
        }

        res.json(ret);
    })
})

app.get('/get-esp-connection', async (req, res) => {

    const currentWifi = await getWifiList();

    return res.json(currentWifi)
})

app.get('/ligar', async (req, res) => {
    return res.json({power:true})
})


app.get('/desligar', async (req, res) => {
    return res.json({power:false})
})

app.post('connect-wifi-by-ssid', (req,res)=> {
    const {ssid, password} = req.body

    wifi.connect({ ssid: ssid, password: password }, (err, cbret) => { // Não funciona para iphone
        if(err) return res.json({err:true})
        
        return res.json({connect:true})
      });
})

function syncronizeEsp(){
    
}

function getCurrentConnection(cb) {
    wifi.getCurrentConnections((error, currentConnections) => {
        if (error) {
            return cb(error, undefined);
        } else {
            return cb(undefined, currentConnections);
        }
    });
}

function getWifiList() {
    return new Promise((resolve, reject) => {
        wifi.scan((error, networks) => {
            if (error) {
                return reject(error)
            } else {
                let espNetwork = networks.find(item => (item.ssid == 'TRIUNFO_GUSTAVO_5G')) // LOCALIZZER

                if (!espNetwork) return getWifiList();
                resolve(espNetwork);
            }
        });
    })
}
// TODO - pesquisar biblioteca que funcione para iphone. Caso não exista, tentar criar uma biblioteca na mão
