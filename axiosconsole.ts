import axios from 'axios'
 
getNewsItems()

function getNewsItems() {
    axios.get('http://localhost:8080/Controller?command=Random')
      .then(response => console.log(response.data))
        .then(()=>setTimeout(getNewsItems, 1000))
}