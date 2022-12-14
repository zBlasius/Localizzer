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

function getWifiList(cb){
    wifi.scan((error, networks) => { 
        return cb(error, networks)
     })
}

function getCurrentConnection(cb) {
    wifi.getCurrentConnections((error, currentConnections) => {
        if (error) {
            return cb(error, undefined);
        } else {
            console.log('teste', currentConnections)
            return cb(undefined, currentConnections);
        }
    });
}

function getLocalizzerConection(ssid) {
    // Obs* funções recursivas consome memória da máquina.
    // Nesse caso seria mais interessante fazer um loop
    return new Promise((resolve, reject) => {
        wifi.scan((error, networks) => {
            if (error) {
                return reject(error)
            } else {
                console.log('netword', networks)
                let espNetwork = networks.find(item => (item.ssid == ssid));

                if (!espNetwork) return getLocalizzerConection();
                resolve(espNetwork);
            }
        });
    })
}

app.get('/synchronize', (req, res, next) => {

    getWifiList((error, ret) => {

        if (error) {

            return res.json(error);
        }

        if(ret?.length == 0) {
            return res.json({notFound:true});
        }

        let regex = /(esp|ESP)/g // * para encontrar o esp32
       // let regex = /(5g|5G)/g;

        const matchWifiEsp = ret.find(item=> regex.test(item.ssid));

        if(matchWifiEsp){
            return res.json(matchWifiEsp);
        }

        return res.status(200).json({notFound:true}); // ? Could this function be better ?
    })
})

app.get('/get-current-connection', (req, res, next) => {
    getCurrentConnection((err, ret) => {
        if (err) {
            return res.status(400).json(err);
        }

        return res.status(200).json(ret);
    })
})

app.get('/get-esp-connection', async (req, res) => {
    const data = req.query;
    const currentWifi = await getLocalizzerConection(data?.ssid);

    return res.json(currentWifi)
})

app.get('/ligar', async (req, res) => {
    const {ssid, passoword} = req.query;
    console.log('teste', ssid)
    wifi.connect({ ssid: ssid, password:12345678 }, () => {
        console.log('Connected'); 
        return res.json({power:true})
  });
  
})

app.get('/desligar', async (req, res) => {
    // todo: remover conexão do esp
    wifi.disconnect( () => {
        return res.json({power:false})
      });
})

app.post('connect-wifi-by-ssid', (req,res)=> {
    const {ssid, password} = req.body

    wifi.connect({ ssid: ssid, password: password }, (err, cbret) => { // Não funciona para iphone
        if(err) return res.json({err:true})
        
        return res.json({connect:true})
      });
})