
const request = require("request");

const sendWhatsappMessage = (phoneNumber, message) => {
    return new Promise((resolve, reject) => {
        var options = {
            'method': 'POST',
            'url': 'https://whats-api.rcsoft.in/api/create-message',
            'headers': {
            },
            formData: {
              'appkey': '83e5191f-be10-4d92-a11e-40e9b4385fc9',
              'authkey': 'gFwZdiOXAgbq2BQc8UA0hqUNSj8uikkvekIxWp3uVk6qX56l1o',
              'to': phoneNumber,
              'message': message
            }
          };
        console.log(phoneNumber,message)

        request(options, function (error, response) {
            if (error) {
                reject(error);
            } else {
                resolve(response.body);
            }
        });
    });
};

module.exports = {
    sendWhatsappMessage
};
