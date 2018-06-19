function timeToString (data){
    if(typeof data != "object") {
        return;
    }
    let year = data.getFullYear();
    let month = data.getMonth() + 1;
    let day = data.getDay();
    return  year + '-' +( month<10?"0"+month:month )+"-"+(day<10?"0"+day:day);
}

let test = timeToString(new Date());

console.log(test);