const express =require("express");
const https=require("https");
const bodyParse=require("body-parser");
const app =express();
const fs=require('fs');

const getCurrentDate=() =>{
    var months=[
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUNE",
        "JULY",
        "AUG",
        "SEPT",
        "OCT",
        "NOV",
        "DEC"
    ];

    var currentTime =new Date();
    var month=currentTime.getMonth();
    var year=currentTime.getFullYear();
    return[months[month],year];
}

//Current Day
const getCurrentDay=() =>{
    var weekdays=new Array(7);
    weekdays[0]="SUNDAY"
    weekdays[1]="MONDAY"
    weekdays[2]="TUESDAY"
    weekdays[3]="WEDNESDAY"
    weekdays[4]="THURSDAY"
    weekdays[5]="FRIDAY"
    weekdays[6]="SATURDAY"
    let currentTime= new Date();
    return(weekdays[currentTime.getDay()]);
}

//Time
const getCurrentTime=()=>{
    var time=new Date();
    var hour=time.getHours();
    var minutes=time.getMinutes();
    let period="AM";
    if(hour > 11){
        period="PM";
        if(hour > 12){
            hour-=12;
        }
    }
    if(minutes < 10)
    {
        minutes= '0'+ minutes;
    }
    return `${hour}:${minutes}:${period}`;
}

const Change_Values=(JSON_DATA)=>{
    const data_html=fs.readFileSync(__dirname+"/views/Simple_Home.html","utf-8")
    let data_real=data_html.replace("{%tempval%}",Math.round(JSON_DATA['main']['temp']) + "\xB0C")
        data_real=data_real.replace("{%tempmin%}",Math.floor(JSON_DATA['main']['temp_min']) + "\xB0C")
        data_real=data_real.replace("{%tempmax%}",Math.floor(JSON_DATA['main']['temp_max']) + "\xB0C")
        data_real=data_real.replace("{%cityname%}",JSON_DATA['name'])
        data_real=data_real.replace("{%country%}",JSON_DATA['sys']['country'])
        data_real=data_real.replace("{%Day%}",getCurrentDay());
        let date=getCurrentDate();
        data_real=data_real.replace("{%Mon%}",date[0]);
        data_real=data_real.replace("{%Year%}",date[1]);
        data_real=data_real.replace("{%Time%}",getCurrentTime());
        data_real=data_real.replace("{%desc%}"," "+JSON_DATA["weather"][0].description.toUpperCase());
        var icon=JSON_DATA["weather"][0].main.charAt(0).toUpperCase();
        data_real=data_real.replace("{%icon%}",icon);
    return data_real;
}

app.use(bodyParse.urlencoded({extended: true}));
app.get("/",function(res,req){
  console.log("Hello")
  query="Pune"
  const appid="19346aecceb02f1c0b75a41383958edd";
  const unit="metric";
  const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+appid+"&units="+unit+"";
  https.get(url ,function(response){
  response.on("data",function(data){
    const weatherData=JSON.parse(data);
      let real=Change_Values(weatherData);
      req.write(real)
      console.log(real)
      req.send();
      req.sendFile(__dirname + "/views/Simple_Home.html");
}); 
});
});
app.post("/",function(req,res){
  query=req.body.cityName;
  const appid="19346aecceb02f1c0b75a41383958edd";
  const unit="metric";
  const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+appid+"&units="+unit+"";
  https.get(url ,function(response){
  response.on("data",function(data){
    const weatherData=JSON.parse(data);
      let real=Change_Values(weatherData);
      res.write(real)
      res.send();
}); 
});
})
app.listen(8000, function(){
  console.log("Server Started At 8000 Port");
});
