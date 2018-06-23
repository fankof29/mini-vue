function timeToString (data){
    if(typeof data != "object") {
        return;
    }
    let year = data.getFullYear();
    let month = data.getMonth() + 1;
    let day = data.getDay();
    return  year + '-' +( month<10?"0"+month:month )+"-"+(day<10?"0"+day:day);
}

function go(){
    console.log('gan')
    return false;
}
let a = 3;
if( true || go()){
    console.log("go")
}else {
    console.log('error')
}