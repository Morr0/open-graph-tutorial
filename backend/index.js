const express = require('express');
const axios = require('axios');
const app = express();

const jsdom = require('jsdom');

const getMetaTags = async (url) => {
    const returnable = {};

    const response = await axios.default({
        url: url,
        method: 'GET',
        responseType: 'text'
    });
    console.log('Received', response);

    const dom = new jsdom.JSDOM(response.data);
    const elms = dom.window.document.querySelectorAll('meta');
    console.log('length', elms.length);
    elms.forEach((elm) => {
        const {content} = elm;
        if (elm.getAttribute('property') === 'og:title') returnable.title = content;
        if (elm.getAttribute('property') === 'og:site_name') returnable.site_name = content;
        if (elm.getAttribute('name') === 'description') returnable.description = content;
    });

    console.log('returnable', returnable);

    return returnable;
};

app.get('/meta', async (req, res) => {
    const { url } = req.query || {};
    if (!url || !url?.includes('http')){
        res.statusCode = 400;
        res.json({
            error: "Please provide a valid url"
        });
        return;
    }
    console.log('Received url', url);

    try {
        const tags = await getMetaTags(url);
        res.statusCode = 200;
        res.json(tags);
    } catch (e){
        console.log(e);
        res.statusCode = 500;
        res.json(e);
    }
});

const PORT = 3500;
app.listen(PORT, () => {
    console.log('LISTENING');
});

