//Module Declaration
const fs=require("fs");
const http=require("http");
const requests = require('requests');

//date month and year
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

//Function to change 
const Change_Values=(JSON_DATA)=>{
    const data_html=fs.readFileSync("Simple_Home.html","utf-8")
    let data_real=data_html.replace("{%tempval%}",Math.round(JSON_DATA['main']['temp']-(273.15)) + "\xB0C")
        data_real=data_real.replace("{%tempmin%}",Math.floor(JSON_DATA['main']['temp_min']-(273.15)) + "\xB0C")
        data_real=data_real.replace("{%tempmax%}",Math.floor(JSON_DATA['main']['temp_max']-(273.15)) + "\xB0C")
        data_real=data_real.replace("{%cityname%}",JSON_DATA['name'])
        data_real=data_real.replace("{%country%}",JSON_DATA['sys']['country'])
        data_real=data_real.replace("{%Day%}",getCurrentDay());
        let date=getCurrentDate();
        data_real=data_real.replace("{%Mon%}",date[0]);
        data_real=data_real.replace("{%Year%}",date[1]);
        data_real=data_real.replace("{%Time%}",getCurrentTime());
        data_real=data_real.replace("{%desc%}",JSON_DATA["weather"][0].description);
    return data_real;
}


//create Server
const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests(
                'https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=19346aecceb02f1c0b75a41383958edd')
            .on('data', (data) => {
                const JSON_API_DATA =JSON.parse(data)
                const real_data=Change_Values(JSON_API_DATA)
                //console.log(real_data)
                res.write(real_data);
            })
            .on('end', (err) => {
               res.end();
            })
    }
});


//Creating Own Server
server.listen(8000,"127.0.0.1");