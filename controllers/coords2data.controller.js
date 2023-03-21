const fetch = require('node-fetch');

function responseData(status,message,error,data){
    const obj = {
        "status" : status,
        "message" : message,
        "error" : error,
        "data" : data
    }
    return obj;
}

async function fetchWeatherInfo(inp){
     const url = `http://api.weatherapi.com/v1/forecast.json?q=${inp}&alerts=yes&days=3`
            console.log(url)
        const params = {
            headers: {
                "key": process.env.weatherapikey
              }
        }
        var result = await fetch(url,params);
        result = await result.json();
        console.log(result);
        return result;

}


exports.coords2data = async (req,res) => {

    try{
        const q = req.body.q;
        var result = await fetchWeatherInfo(q)
        return res.status(200).send(responseData(200,"Fetched Data",false,result));
    }
    catch(err){
        return res.status(400).send({error:err});
    }

}
