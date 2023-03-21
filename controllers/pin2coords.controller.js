const fetch = require('node-fetch');
const { weatherModel } = require('../database/models/weatherinfo');

const fetchWeatherInfo = async (inp) => {
  const url = `http://api.weatherapi.com/v1/forecast.json?q=${inp}&alerts=yes&days=3`
        //  console.log(url)
     const params = {
         headers: {
             "key": process.env.weatherapikey
           }
     }
     var result = await fetch(url,params);
     result = await result.json();
    //  console.log(result);
     return result;

}


async function fetchCoords(params) {
  const where = encodeURIComponent(JSON.stringify({
    "postalCode": params
  }));
  
  const url = `https://parseapi.back4app.com/classes/Indiapincode_Dataset_India_Pin_Code?limit=10&where=${where}`;
    // console.log(url);          

  const response = await fetch( url
    ,
    {
      headers: {
        'X-Parse-Application-Id': 'zz7jhD5Q4JeXP0v0DEh3noRpqnb9tdoq0Ptx0RQB', // This is your app's application id
        'X-Parse-REST-API-Key': 'c3MHx5fzs2pwFXGKP5QnMXTUDNHrkyTmQUdiLfHh', // This is your app's REST API key
      }
    }
  );
  const data = await response.json(); // Here you have the data that you need
    return data.results[0]
  
}



exports.pin2coords = async (req,res) => {
    try{
      const data = await fetchCoords(req.body.pincode);

      // const where = encodeURIComponent(JSON.stringify({
      //   "postalCode": req.body.pincode
      // }));
      
      // const url = `https://parseapi.back4app.com/classes/Indiapincode_Dataset_India_Pin_Code?limit=10&where=${where}`;
      //   console.log(url);          
    
      // const response = await fetch( url
      //   ,
      //   {
      //     headers: {
      //       'X-Parse-Application-Id': 'zz7jhD5Q4JeXP0v0DEh3noRpqnb9tdoq0Ptx0RQB', // This is your app's application id
      //       'X-Parse-REST-API-Key': 'c3MHx5fzs2pwFXGKP5QnMXTUDNHrkyTmQUdiLfHh', // This is your app's REST API key
      //     }
      //   }
      // );
      // const data = await response.json(); // Here you have the data that you need

      return res.status(200).send(data.geoPosition)

       
    }
    catch(err){
        return res.status(400).send({error:err});
    }
}

exports.addpin = async (req,res) => {
  try{
    // console.log("hellllllllllllloooooooooooo")
      const pincode = req.body.pincode;
      const pinExists = await weatherModel.findOne({ pincode });

      const coords1 = await fetchCoords(pincode)
      // console.log(coords1);

      var newCoords = String(coords1.geoPosition.latitude+","+coords1.geoPosition.longitude)
      // console.log(newCoords)
      const info = await fetchWeatherInfo(newCoords);
      // console.log(info)

      var finalInfo = `The weather for ${info.forecast.forecastday[0].date} will be : ${info.forecast.forecastday[0].day.condition.text} with avg temp ${info.forecast.forecastday[0].day.avgtemp_c} °C and humidity ${info.forecast.forecastday[0].day.avghumidity} with ${info.forecast.forecastday[0].day.daily_chance_of_rain} chances of rain.\nThe weather for ${info.forecast.forecastday[1].date} will be : ${info.forecast.forecastday[1].day.condition.text} with avg temp ${info.forecast.forecastday[1].day.avgtemp_c} °C and humidity ${info.forecast.forecastday[1].humidity} with ${info.forecast.forecastday[1].day.daily_chance_of_rain} chances of rain.\nThe weather for ${info.forecast.forecastday[2].date} will be : ${info.forecast.forecastday[2].day.condition.text} with avg temp ${info.forecast.forecastday[2].day.avgtemp_c} °C and humidity ${info.forecast.forecastday[2].day.humidity} with ${info.forecast.forecastday[2].day.daily_chance_of_rain} chances of rain.\n`

      // console.log(finalInfo)

      if(pinExists){
        pinExists.info = finalInfo;
        pinExists.save()
        return res.status(200).send(pinExists)
      }
      
      const newPin = new weatherModel({
        pincode,
        coords : newCoords,
        info : finalInfo
      })

      newPin.save()

      return res.status(200).send(newPin)
  }catch(err)
  {
    return res.status(400).send({error:err});
  }
}