import http  from 'http'
import axios from 'axios'
import json2html from 'node-json2html'


const hostname = 'localhost'
const port = 9000

const server = http.createServer((req, res) => {
    const path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase()
    switch(path) {
        case '/hello':
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.write('Hello world!')
            res.end();
            break
        case '/news/all':
            res.writeHead(200, { 'Content-Type': 'text/html' })
            // call data => build html with data => write html => end response
            makeGetRequest().then(data => buildHtml(data)).then(html => res.write(html)).then(() => res.end())
            break
        case '/news/add':
              //http://localhost:9000/news/add?title=test&text=hallo&author=marlene
            res.writeHead(200, { 'Content-Type': 'text/html' })
            let title = req.url.split('&')[0].split('=')[1]
            let text = req.url.split('&')[1].split('=')[1]
            let author = req.url.split('&')[2].split('=')[1]
            makePostRequest(title, text, author).then(r => "error")
            res.writeHead(302, { 'Location': '/news/all' })
            res.end()
    }
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/ press Ctrl-C to terminate....`)
 })

async function makeGetRequest () {
    let res = await axios.get('http://localhost:8080/Controller?command=Random')
    return res.data
}

async function makePostRequest (title, text, author) {
    let res =  await axios.post('http://localhost:8080/Controller?command=Add' + "&title_input=" + title + "&text_input=" + text + "&author_input=" + author);
    return res;
}

function buildHtml(data) {
    let html = json2html.transform(data,
        {"<>": "li", "html":[{"<>": "span", "text": "${title} ${text} ${author} ${date.dayOfMonth}  ${date.month}  ${date.year}"}]})
 
    return  '<!DOCTYPE html>'+ 
            '<html>'+
                '<head>NEWS ITEMS</head>'+ 
                '<body>' + html + '</body>'+
            '</html>'
  }