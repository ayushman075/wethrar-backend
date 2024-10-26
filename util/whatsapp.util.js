import request from "request"


const sendWhatsappMessage = async (phone,message) => {
    if(!phone || !message){
        return false
    }
    try {
        var options = {
            method: 'GET',
            url: 'https://panel.rapiwha.com/send_message.php',
            qs: {apikey: process.env.RAPIWHA_API, number: phone, text: message}
          };
          
          request(options, function (error, response, body) {
            if (error) {
                return true
            }
            if(response){
                return false
            }
           
          });
    } catch (error) {
        return false
    }
}

export default sendWhatsappMessage;