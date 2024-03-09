const Quotes = require('../model/quotes-model');

const reachCheckPoint = async (req, res) => {
    try {
        let quotesList = await Quotes.find();
        
        if (quotesList.length === 0) {
            return res.status(404).json({ message: 'No quotes found.' });
        }
        const randomIndex = Math.floor(Math.random() * quotesList.length);

        const randomQuote = quotesList[randomIndex];

        res.json({ quote: randomQuote });
    } catch (error) {
        console.log("error on reach check point ", error);
        res.status(501).send({ error: error.message })
    }   
}

module.exports = {
    reachCheckPoint
}