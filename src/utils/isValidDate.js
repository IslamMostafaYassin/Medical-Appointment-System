const isValidDate=(dateString)=>{
	const date=new Date(dateString)
	if (date.getTime()<Date.now()){
		return false
	}
	console.log(date.getTime(),"\n",Date.now())
	if (date.getTime()>Date.now()+30*24*60*60*1000){
		return false
	}
	return  date.getMinutes()%30===0 &&
			date.getSeconds()===0 &&
			date.getMilliseconds()===0;
}

module.exports=isValidDate