const functions = require('@google-cloud/functions-framework');
const axios = require('axios');

const roundCents = (rawPrice) => Math.round((rawPrice + Number.EPSILON) * 100) / 100

functions.http('serverlessFunction', async (req, res) => {
    //Begin CORS handling
    res.set('Access-Control-Allow-Origin', "*")
    res.set('Access-Control-Allow-Methods', 'GET');
  
    if (req.method === "OPTIONS") {
      // stop preflight requests here
      res.status(204).send('');
      return;
    }
    //End CORS handling
    if (req.method == 'GET') {
        const amount = (req.query.totalCents ?? 100)/100
        const xchange = await axios.get("https://api.exchangerate.host/latest?base=SGD&symbols=SGD,USD,EUR,JPY,BTC")
        if (xchange.data.success) {
            const rates = xchange.data.rates;
            const finalAmounts = {}
            Object.getOwnPropertyNames(rates).forEach((target) => {
                finalAmounts[target] = rates[target] * amount;
                if (target != "BTC") {
                    finalAmounts[target] = roundCents(finalAmounts[target])
                }
            })
            res.status(200).send(finalAmounts)
        } else {
            res.status(500).send({message: "API source failed"})
        }
    } else {
        res.status(405).send({message: "Method not allowed"})
    }
});