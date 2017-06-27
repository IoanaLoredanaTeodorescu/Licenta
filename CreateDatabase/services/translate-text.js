const Translate = require('@google-cloud/translate');

// Your Google Cloud Platform project ID
const projectId = 'licentajusttest';

// Instantiates a client
const translateClient = Translate({
  projectId: projectId
});
//aici e functia de translate
var translation = '';
//inca ceva
//result[0] e rzultatul bun
//dar si results[1].data.translations[0].translatedText
//gata

module.exports = {
    translateTextInEn: (text, target) => {
        // Translates some text into English
        //console.log(text,target);
        translateClient.translate(text, target)
         .then ((results) => {

            //translation = results[0];
            // console.log(`Text: ${text}`);
            // console.log(`Translation: ${translation}`);
            return results[1].data.translations[0].translatedText;
            //return translation;

            // var message = results[1].data.translations[0].translatedText;
            // return message;
          })
          .catch((err) => {
            console.error('ERROR:', err);
          });
    }
}
